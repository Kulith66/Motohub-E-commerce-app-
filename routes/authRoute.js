import express from 'express';
import {loginController, registerController,testController,frogotPasswordController, 
    updateProfileController, } from '../controllers/authController.js';
import { requireSignIn ,isAdmin} from '../middlewares/authMddleware.js';
import { getOrderController } from '../controllers/authController.js';

//router object
const router = express.Router()

//routing method - post

router.post('/register',registerController)

//ROUTING METHOD- POST
router.post('/login',loginController)

//test
router.get('/test',requireSignIn,isAdmin,testController)

//Progot password
router.post('/frogotPassword',frogotPasswordController)


//protected routes

router.get("/user-auth",requireSignIn,(req,res)=>{
    res.status(200).send({ok:true});
})
// Protected admin auth route
router.get("/admin-auth",requireSignIn,isAdmin, (req,res)=>{
    res.status(200).send({ok:true});
})

//update profile
router.put('/updateProfile',requireSignIn,updateProfileController)
// get orders
router.get('/getOrder',  getOrderController);







export default router;