import productModels from "../models/productModels.js";
import fs from "fs";
import slugify from "slugify";
import mongoose from "mongoose";
import categoryModels from "../models/categoryModels.js";
import orderModels from "../models/orderModels.js"
import braintree from "braintree";
import dotenv from "dotenv"
dotenv.config();


//payment getway
var gateway = new braintree.BraintreeGateway({
  environment:braintree.Environment.Sandbox,
  merchantId:process.env.BRAINTREE_MERCHANT_ID,
  publicKey:process.env.BRAINTREE_PUBLIC_KEY,
  privateKey:process.env.BRAINTREE_PRIVATE_KEY,
});
export const createProductController = async (req, res) => {
  try {
    const { nickName } = req.fields;
    const { photo } = req.files;

    // Validation
    
    const product = new productModels({ ...req.fields, slug: slugify(nickName) });

    if (photo) {
      product.photo.data = fs.readFileSync(photo.path);
      product.photo.contentType = photo.type;
    }

    await product.save();

    res.status(201).send({
      success: true,
      message: "Product created successfully",
      product,
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).send({
      success: false,
      message: "Error in creating product",
    });
  }
};

export const getProductController = async (req, res) => {
  try {
    const products = await productModels.find({})
      .populate("category")
      .select("-photo")
      .limit(12)
      .sort({ createdAt: -1 });

    res.status(200).send({
      success: true,
      message: "Successfully fetched products",
      countTotal: products.length,
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in fetching products",
      error: error.message,
    });
  }
};

export const getSingleProductController = async (req, res) => {
  try {
    const product = await productModels.findOne({ slug: req.params.slug })
      .select("-photo")
      .populate("category");

    res.status(200).send({
      success: true,
      message: "Successfully fetched product",
      product,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in fetching product",
      error: error.message,
    });
  }
};

export const productPhotoController = async (req, res) => {
  try {
    const product = await productModels.findById(req.params.pid).select("photo");
    if (product.photo.data) {
      res.set("Content-Type", product.photo.contentType);
      return res.status(200).send(product.photo.data);
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in fetching photo",
      error: error.message,
    });
  }
};

export const deleteProductController = async (req, res) => {
  try {
    await productModels.findByIdAndDelete(req.params.pid).select("-photo");
    res.status(200).send({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in deleting product",
      error: error.message,
    });
  }
};

export const updateProductController = async (req, res) => {
  try {
    const { name, description, price, category, quantity, shipping } = req.fields;
    const { photo } = req.files;

    // Validation
    switch (true) {
      case !name:
        return res.status(400).send({ error: "Name is required" });
      case !description:
        return res.status(400).send({ error: "Description is required" });
      case !price:
        return res.status(400).send({ error: "Price is required" });
      case !category:
        return res.status(400).send({ error: "Category is required" });
      case !quantity:
        return res.status(400).send({ error: "Quantity is required" });
      case photo && photo.size > 1000000:
        return res.status(400).send({ error: "Photo should be less than 1MB" });
    }

    // Ensure shipping is a boolean or handle its absence
    const updateFields = { ...req.fields, slug: slugify(name) };
    if (typeof shipping !== 'undefined') {
      updateFields.shipping = Boolean(shipping);
    }

    const product = await productModels.findByIdAndUpdate(
      req.params.id,
      updateFields,
      { new: true }
    );

    // Check if product was found
    if (!product) {
      return res.status(404).send({ error: "Product not found" });
    }

    // Handle photo update if provided
    if (photo) {
      product.photo.data = fs.readFileSync(photo.path);
      product.photo.contentType = photo.type;
    }

    await product.save();
    

    res.status(200).send({
      success: true,
      message: "Product updated successfully",
      product,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in updating product",
      error: error.message,
    });
  }
};

export const productFilterController = async (req, res) => {
  try {
    const { checked = [], radio = [] } = req.body;

    let args = {};
    if (checked.length > 0) args.category = { $in: checked };
    if (radio.length === 2) args.price = { $gte: radio[0], $lte: radio[1] };

    const products = await productModels.find(args);

    res.status(200).send({
      success: true,
      message: "Filtering completed successfully",
      products,
    });
  } catch (error) {
    console.error("Error while filtering products:", error);
    res.status(400).send({
      success: false,
      message: "Error while filtering products",
      error: error.message,
    });
  }
};

export const productCountController = async (req, res) => {
  try {
    const total = await productModels.estimatedDocumentCount();
    res.status(200).send({
      success: true,
      total,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      error,
      message: "Error in product count",
    });
  }
};

export const productListController = async (req, res) => {
  try {
    const perPage = 6;
    const page = req.params.page ? req.params.page : 1;

    const products = await productModels.find({})
      .select("-photo")
      .skip((page - 1) * perPage)
      .limit(perPage)
      .sort({ createdAt: -1 });

    res.status(200).send({
      success: true,
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      error,
      message: "Error in product list",
    });
  }
};

export const searchProductController = async (req, res) => {
  try {
    const { keyword } = req.params;
    const results = await productModels.find({
      $or: [
        { name: { $regex: keyword, $options: "i" } },
        { description: { $regex: keyword, $options: "i" } },
      ],
    }).select("-photo");

    res.status(200).send(results);
  } catch (error) {
    console.log(error);
    res.status(400).send({
      message: "Error in search product",
      error: error.message,
    });
  }
};

export const relatedProductController = async (req, res) => {
  try {
    const { pid, cid } = req.params;
    const products = await productModels.find({
      category: cid,
      _id: { $ne: pid },
    })
    .select("-photo")
    .limit(3)
    .populate("category");

    res.status(200).json({
      success: true,
      message: "Related products retrieved successfully",
      products,
    });
  } catch (error) {
    console.error("Error in getting related products:", error);
    res.status(500).json({
      success: false,
      message: "Error in getting related products",
      error: error.message,
    });
  }
};

export const categoryProductController = async (req, res) => {
  try {
    // Find category by _id
    const cat = await categoryModels.find({slug:req.params.slug});
    console.log(cat);
    if (!category) {
      return res.status(404).send({
        success: false,
        message: "Category not found",
      });
    }

    // Find products by category _id
    const products = await productModels.find(cat._id).populate('category');
    res.status(200).send({
      success: true,
      message: "Products retrieved successfully",
      cat,
      products,
    });
  } catch (error) {
    console.error("Error in getting products:", error);
    res.status(500).send({
      success: false,
      message: "Error in getting products",
      error: error.message,
    });
  }
};

//payment getway

export const braintreeTokenController = async (req,res)=>{
  try {
    gateway.clientToken.generate({},function(err,response){
      if(err){
        res.status(500).send(err);
      }else{
        res.status(200).send(response)
      }
    })
  } catch (error) {
    console.log(error)
  }
}

export const braintreePaymentController = async (req,res)=>{
  try {
    const {cart,nonce} =req.body;
    let total = 0;
    cart.map((i)=>{
      total += i.price
    });
    let newTransaction = gateway.transaction.sale({
      amount:total,
      paymentMethodNonce:nonce,
      options:{
        submitForSettlement:true
      }
      },
      function (error,result){
        if(result){
            const order = new orderModels({
              products:cart,
              payment:result,
              buyer:req.user._id,
            
              })
               order.save();
              res.json({ ok: true });
        }else{
          res.status(500).send(error)
        }
      }
  )
  } catch (error) {
    console.log(error)
  }
}

