import fs from "fs";
import orderModels from "../models/orderModels.js";

export const getOrderController = async (req, res) => {
        const userId =req.user;
  try {
    const orders = await orderModels.find( {buyer:userId} )
      .populate('products', '-photo')
      .populate('buyer', 'name');
    res.json(orders);
  } catch (error) {
    console.error('Error in getOrderController:', error); // Log the error for debugging
    res.status(500).send({
      success: false,
      message: 'Error in getting orders',
      error: error.message // Optionally include error message
    });
  }
};