import express from 'express';
import {requireSignIn ,isAdmin} from '../middlewares/authMddleware.js'
import {
    createCategoryController,
    updateCategoryController,categoryController,singleCategoryController,
    deleteCategoryController,
    } from '../controllers/categoryController.js'

const router =express.Router();

//craete category 
router.post('/createCategory',requireSignIn,isAdmin,createCategoryController)

//update routes

router.put('/updateCategory/:id',requireSignIn,isAdmin,updateCategoryController)

//Get all categorry
router.get('/getCategory' ,categoryController)

//single Category

router.get('/singleCategory',singleCategoryController)
//remove category

router.delete('/deleteCategory/:pId',deleteCategoryController)



export default router;