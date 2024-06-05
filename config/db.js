import mongoose from "mongoose";

const connectDB =async ()=>{
   try {
    const conn = await mongoose.connect(process.env.MONGODB_URL);
    console.log('connect to the mongoDB');
    console.log(conn.connection.host)
   } catch (error) {
    console.log('error in mongoDB'+ error)
   }
}

export default connectDB;