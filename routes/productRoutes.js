import express from 'express'
import { isAdmin, requireSignIn } from '../middlewares/authMddleware.js';
import { createProductController,
         deleteProductController,
         getProductController,
         getSingleProductController, 
         productPhotoController,
         updateProductController,
         productCountController,
        productFilterController,
        productListController,
        searchProductController,
        relatedProductController,
        categoryProductController,
        braintreeTokenController,
        braintreePaymentController}
 from '../controllers/productController.js';
import  formidable from  'express-formidable'

const router = express();

//routes
router.post('/createProduct',requireSignIn,isAdmin,formidable(),createProductController)

//get products

router.get('/getAllProduct/:page',getProductController)

//get single product
router.get('/getSingleProduct/:slug',getSingleProductController)

//getPhoto

router.get('/getProductPhoto/:pid',productPhotoController)
//delete product

router.delete('/deleteProduct/:pid',deleteProductController)
//update 
router.put('/updateProduct/:id',requireSignIn,isAdmin,formidable(),updateProductController)
//filter
router.post("/filterProduct",productFilterController)
//count
router.get("/totalCount",productCountController)

//list
router.get("/listControl/:page",productListController)


//search
router.get("/searchProduct/:keyword",searchProductController)

//similer products
router.get("/relatedProducts/:pid/:cid",relatedProductController)
//product routes
router.get("/categoryProducts/:slug",categoryProductController)

//payment
//token
router.get("/braintree/token",braintreeTokenController)


//payments
router.post("/braintree/payment",requireSignIn,braintreePaymentController)




export default router;