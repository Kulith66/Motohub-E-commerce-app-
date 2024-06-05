import mongoose, { Schema } from "mongoose";
// Assuming your Order schema looks something like this:

const orderSchema = new Schema({
  products: [{
    type: Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  }],
  payment: {},
  buyer: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  status: {
    type: String,
    enum: ['Not process', 'processing', 'Shipped', 'delivered', 'Cancelled'],
    default: 'Not process',
  },
  // other fields...
});



 export default mongoose.model("order",orderSchema);