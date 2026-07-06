import validator from 'validator';
import bcrypt from 'bcrypt';
import userModel from '../models/userModel.js';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import doctorModel from "../models/doctorModel.js";
import appointmentModel from "../models/appointmentModel.js";
import razorpay from 'razorpay';
import stripe from 'stripe';
import {v2 as cloudinary} from 'cloudinary'
// Load environment variables
dotenv.config();
const RAZORPAY_KEY_ID=process.env.RAZORPAY_KEY_ID

const RAZORPAY_KEY_SECRET=process.env.RAZORPAY_KEY_SECRET
const JWT_SECRET = process.env.JWT_SECRET ; 
const razorpayInstance = new razorpay({
    key_id: process.env.key_id,
    key_secret: process.env.key_secret,
})
const CURRENCY ="INR"
// ✅ Register User
const registerUser = async (req, res) => {
    try {
        const { name, email, password, image } = req.body;

        if (!name || !password || !email) {
            return res.status(400).json({ success: false, message: "Missing Details" });
        }

        if (!validator.isEmail(email)) {
            return res.status(400).json({ success: false, message: "Enter a valid email" });
        }

        if (password.length < 8) {
            return res.status(400).json({ success: false, message: "Password must be at least 8 characters long" });
        }

        // Check if user already exists
        const existingUser = await userModel.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ success: false, message: "Email already in use" });
        }

        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Use provided image or default
        const userImage = image 

        // Create the new user
        const newUser = new userModel({
            name,
            email,
            password: hashedPassword,
            image: userImage
        });

        await newUser.save();

        // Generate JWT token
        const token = jwt.sign({ id: newUser._id }, JWT_SECRET, { expiresIn: '7d' });

        // Return both token and user data
        res.json({
            success: true,
            token,
            user: {
                id: newUser._id,
                name: newUser.name,
                email: newUser.email,
                image: newUser.image
            }
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Server error. Please try again later." });
    }
};

// ✅ Login User
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await userModel.findOne({ email });

        if (!user) {
            return res.status(404).json({ success: false, message: 'User does not exist' });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({ success: false, message: "Invalid credentials" });
        }

        // Generate JWT token
        const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '7d' });

        // Return token and user info
        res.json({
            success: true,
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                image: user.image
            }
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};
const getProfile = async (req, res) => {

    try {
        const { userId } = req.body
        const userData = await userModel.findById(userId).select('-password')

        res.json({ success: true, userData })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}
const updateProfile = async (req, res) => {
    try {
      const { userId, name, phone, address, dob, gender } = req.body;
      const imageFile = req.files?.image?.[0];
      const documentFiles = req.files?.documents || [];
  
      if (!name || !phone || !dob || !gender) {
        return res.json({ success: false, message: "Data Missing" });
      }
  
      // Update basic profile info
      await userModel.findByIdAndUpdate(userId, {
        name,
        phone,
        address: JSON.parse(address),
        dob,
        gender
      });
  
      // Upload profile image to Cloudinary if provided
      if (imageFile) {
        await new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            { resource_type: 'image' },
            async (error, result) => {
              if (error) return reject(error);
              await userModel.findByIdAndUpdate(userId, { image: result.secure_url });
              resolve();
            }
          );
          stream.end(imageFile.buffer);
        });
      }
  
      // Upload documents to Cloudinary if any
      const uploadedDocs = [];
  
      for (const file of documentFiles) {
        const uploaded = await new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            { resource_type: 'auto', folder: 'documents' },
            (err, result) => {
              if (err) return reject(err);
              resolve(result);
            }
          );
          stream.end(file.buffer);
        });
  
        uploadedDocs.push({
          url: uploaded.secure_url,
          type: file.mimetype,
          public_id: uploaded.public_id
        });
      }
  
      if (uploadedDocs.length > 0) {
        await userModel.findByIdAndUpdate(userId, {
          $push: { documents: { $each: uploadedDocs } }
        });
      }
  
      res.json({ success: true, message: 'Profile Updated' });
    } catch (error) {
      console.log(error);
      res.json({ success: false, message: error.message });
    }
  };
  
const bookAppointment = async (req, res) => {

    try {

        const { userId, docId, slotDate, slotTime } = req.body
        const docData = await doctorModel.findById(docId).select("-password")

        if (!docData.available) {
            return res.json({ success: false, message: 'Doctor Not Available' })
        }

        let slots_booked = docData.slots_booked

        // checking for slot availablity 
        if (slots_booked[slotDate]) {
            if (slots_booked[slotDate].includes(slotTime)) {
                return res.json({ success: false, message: 'Slot Not Available' })
            }
            else {
                slots_booked[slotDate].push(slotTime)
            }
        } else {
            slots_booked[slotDate] = []
            slots_booked[slotDate].push(slotTime)
        }

        const userData = await userModel.findById(userId).select("-password")

        delete docData.slots_booked

        const appointmentData = {
            userId,
            docId,
            userData,
            docData,
            amount: docData.fees,
            slotTime,
            slotDate,
            date: Date.now()
        }

        const newAppointment = new appointmentModel(appointmentData)
        await newAppointment.save()

        // save new slots data in docData
        await doctorModel.findByIdAndUpdate(docId, { slots_booked })

        res.json({ success: true, message: 'Appointment Booked' })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }

}
const cancelAppointment = async (req, res) => {
    try {

        const { userId, appointmentId } = req.body
        const appointmentData = await appointmentModel.findById(appointmentId)

        // verify appointment user 
        if (appointmentData.userId !== userId) {
            return res.json({ success: false, message: 'Unauthorized action' })
        }

        await appointmentModel.findByIdAndUpdate(appointmentId, { cancelled: true })

        // releasing doctor slot 
        const { docId, slotDate, slotTime } = appointmentData

        const doctorData = await doctorModel.findById(docId)

        let slots_booked = doctorData.slots_booked

        slots_booked[slotDate] = slots_booked[slotDate].filter(e => e !== slotTime)

        await doctorModel.findByIdAndUpdate(docId, { slots_booked })

        res.json({ success: true, message: 'Appointment Cancelled' })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}
const listAppointment = async (req, res) => {
    try {

        const { userId } = req.body
        const appointments = await appointmentModel.find({ userId })

        res.json({ success: true, appointments })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}
const paymentRazorpay = async (req, res) => {
    try {

        const { appointmentId } = req.body
        const appointmentData = await appointmentModel.findById(appointmentId)

        if (!appointmentData || appointmentData.cancelled) {
            return res.json({ success: false, message: 'Appointment Cancelled or not found' })
        }

        // creating options for razorpay payment
        const options = {
            amount: appointmentData.amount * 100,
            currency: "INR",
            receipt: appointmentId,
        }

        // creation of an order
        const order = await razorpayInstance.orders.create(options)

        res.json({ success: true, order })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}
const uploadDocuments = async (req, res) => {
    try {
      const { userId } = req.body;
      const files = req.files;
  
      if (!files || files.length === 0) {
        return res.json({ success: false, message: "No files uploaded" });
      }
  
      const uploadedDocs = [];
  
      for (const file of files) {
        const uploaded = await new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            {
              resource_type: 'auto',
              folder: 'documents',
            },
            (error, result) => {
              if (error) return reject(error);
              resolve(result);
            }
          );
  
          stream.end(file.buffer); // use buffer, not file.path
        });
  
        uploadedDocs.push({
          url: uploaded.secure_url,
          type: file.mimetype,
          public_id: uploaded.public_id,
        });
      }
  
      await userModel.findByIdAndUpdate(
        userId,
        { $push: { documents: { $each: uploadedDocs } } },
        { new: true }
      );
  
      res.json({ success: true, message: "Documents uploaded", documents: uploadedDocs });
    } catch (error) {
      console.log(error);
      res.json({ success: false, message: error.message });
    }
  };
  
  

export { registerUser,loginUser,getProfile,updateProfile,bookAppointment,listAppointment,cancelAppointment,paymentRazorpay,uploadDocuments};
