import mongoose, { Schema } from "mongoose";

const categorySchema = new mongoose.Schema({
    name:{
        type:String,
     //   required:true,
    //    unique:true
    },
    slug:{
        type :String,
        required:true,

    }
});
 export default mongoose.model("Category",categorySchema);