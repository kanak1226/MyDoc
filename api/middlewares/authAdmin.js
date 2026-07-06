import jwt from 'jsonwebtoken';

const adminEmail = ""; // Replace with actual admin email
const adminPassword = "";       // Replace with actual admin password
const JWT_SECRET = process.env.JWT_SECRET;

const authAdmin = async (req, res, next) => {
    try {
        // Extract token from Authorization header
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ success: false, message: 'Not Authorized, Login Again' });
        }

        const token = authHeader.split(' ')[1];  // Extract the token after "Bearer"
        
        // Verify token
        const token_decode = jwt.verify(token, JWT_SECRET);

        // Check if the decoded payload contains the correct admin credentials
        if (token_decode.email !== adminEmail || token_decode.password !== adminPassword) {
            return res.status(403).json({ success: false, message: 'Not Authorized, Invalid Token' });
        }

        next();
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: error.message });
    }
};

export default authAdmin;
