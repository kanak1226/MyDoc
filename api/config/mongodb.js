import mongoose from "mongoose"
//import connectDB from './config/mongodb.js' // Note the .js extension here

const connectDB = async()=>{

    mongoose.connection.on('connected', () => console.log("Database Connected"))
    await mongoose.connect (process.env.mongoose.connect)
}
export default connectDB