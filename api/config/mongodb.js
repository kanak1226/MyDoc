import mongoose from "mongoose"
//import connectDB from './config/mongodb.js' // Note the .js extension here

const connectDB = async()=>{

    mongoose.connection.on('connected', () => console.log("Database Connected"))
    await mongoose.connect('mongodb+srv://746asmisharma:asmikanak@cluster0.cg1rw.mongodb.net/')
}
export default connectDB