import jwt from 'jsonwebtoken';

const JWT_SECRET = "kanakdeora";

const authDoctor = async (req, res, next) => {
    // Get the token from Authorization header
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ success: false, message: 'Not Authorized, Login Again' });
    }

    const token = authHeader.split(' ')[1];  // Extract the token after 'Bearer'

    try {
        const token_decode = jwt.verify(token, JWT_SECRET);
        req.body.docId = token_decode.id;   // Attach the doctor ID to the request body
        next();
    } catch (error) {
        console.error('Token Verification Failed:', error);
        return res.status(401).json({ success: false, message: 'Invalid or Expired Token' });
    }
};

export default authDoctor;
