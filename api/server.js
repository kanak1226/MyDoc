import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import connectDB from './config/mongodb.js'
import connectCloudinary from './config/cloudinary.js'

// Import routes
import adminRouter from './routes/adminRouter.js'
import doctorRouter from './routes/doctorRouter.js'
import userRouter from './routes/userRouter.js'
import authRoutes from './routes/auth.js'  // ✅ Google Auth route
//import contactRouter from './routes/contact.jsx'; // ✅ exact name


// App config
const app = express()
const port = process.env.PORT || 4001


connectDB()
connectCloudinary()

// Middleware
app.use(cors())
app.use(express.json())

// API Endpoints
app.use('/api/admin', adminRouter)
app.use('/api/doctor', doctorRouter)
app.use('/api/user', userRouter)
app.use('/api/auth', authRoutes)  



// Root routeimport contactRouter from './routes/contact.jsx'; // ✅ exact name
 // ✅ now it knows what "contactRouter" is

app.get('/', (req, res) => {
  res.send('API WORKING yahooooooo');
})

// Server listen
app.listen(port, () => console.log("Server started on port", port))
