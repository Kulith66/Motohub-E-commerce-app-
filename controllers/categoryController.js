import categoryModels from "../models/categoryModels.js";
import slugify from "slugify";


export const createCategoryController =async (req,res)=>{
    try {
        const {name} =req.body;
        if(!name){
            return res.status(401).send({
                message: 'name required'
            })
        }
        const existingCategory = await categoryModels.findOne({name})
        if(existingCategory){
            return res.status(200).send({
                success:true,
                message:'Category allredy exists'
            })

        }
        const category = await new categoryModels({name,slug:slugify(name)}).save()
        res.status(201).send(({
            success:true,
            message:'new category created',
            category
        }))
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success:false,
            message:"category Allredy exists"
        })
    }
} 

export const updateCategoryController = async (req, res) => {
    try {
        const { name } = req.body;
        const { id } = req.params;
        
        // Correct usage: pass only the ID as the first argument
        const category = await categoryModels.findByIdAndUpdate(
            id, // Correct: Pass only the ID here
            { name, slug: slugify(name) },
            { new: true }
        );

        res.status(201).send({
            success: true,
            message: 'Category updated successfully',
            category,
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: 'Error while updating category',
            error,
        });
    }
};

export const categoryController = async (req,res) =>{
    try {
        const category = await categoryModels.find({});
        res.status(200).send({
            success:true,
            message:'All category Lisst',
            category,
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success:false,
            message:"error in get all categories"
            ,error
        })
    }
}

export const singleCategoryController = async (req,res)=>{
    try {
        const category = await categoryModels.findOne({slug:req.params.slug
        });
        res.status(201).send({
            success:true,
            message: 'get single category successfully',
            category
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success:false,
            message:"error in get single categories"
            ,error
        })
    } 
}


export const deleteCategoryController = async (req, res) => {
  try {
    const { pId } = req.params;
    console.log(pId)
    const deletedCategory = await categoryModels.findByIdAndDelete(pId);

    if (!deletedCategory) {
      return res.status(404).send({
        success: false,
        message: "Category not found",
      });
    }

    res.status(200).send({
      success: true,
      message: "Category deleted successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in deleting category",
      error: error.message, // Include error message for better debugging
    });
  }
};
