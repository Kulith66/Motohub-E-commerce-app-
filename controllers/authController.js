import userModels from "../models/userModels.js";
import orderModels from "../models/orderModels.js";

import { comparePassword, hashedPassword as hashPassword } from "../helpers/authHelpers.js"; // Rename imported function
import JWT, { decode } from "jsonwebtoken";

export const registerController = async (req, res) => {
    try {
        const { name, email, password, phone, address ,question,answer} = req.body;
        if (!name) {
            return res.send({ message
                : "Name is required" });
        }
        if (!email) {
            return res.send({ message: "Email is required" });
        }
        if (!password) {
            return res.send({ message: "password is required" });
        }
        if (!phone) {
            return res.send({ message: "phone is required" });
        }
        if (!address) {
            return res.send({message: "address is required" });
        }
        if (!answer) {
            return res.send({message: "answer is required" });
        }
        if (!question) {
            return res.send({message: "question is required" });
        }

        // Check if user exists
        const existingUser = await userModels.findOne({ email });
        // If user exists
        if (existingUser) {
            return res.status(201).send({
                success: false,
                message: 'Already registered, please login'
            });
        }
        // Hash the password
        const hashedPassword = await hashPassword(password); // Renamed variable

        // Create and save user
        const user = await new userModels({ name, email, password: hashedPassword, phone, address,question,answer }).save();

        res.status(201).send({
            success: true,
            message: 'User registered successfully!!',
            user
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error in registration",
            error
        });
    }
};

//POST LOGIN
export const loginController = async (req,res)=>{
    try {
        const {email,password}=req.body;

        //validation
        if(!password || !email){
            return res.status(404).send({
                success : false,
                massage : "invalid password or email"
            })

        }
        //check user
        const user = await userModels.findOne({email})
        
        if(!user){
            return res.status(404).send({
                success:false,
                massage:"email is not regisered ,please register"
            })
        }
        const match = await comparePassword(password,user.password)
        if(!match){
            return res.status(200).send({
                success :false,
                massage :"invalid password"
            })
        }
        //token
        const token =await JWT.sign({_id:user._id},process.env.JWT_SECRET,{expiresIn:'7d'})

        res.status(200).send({
            success:true,
            massage:"login succefully",
            user: {
                name:user.name,
                email:user.email,
                phone :user.phone,
                address:user.address,
                role :user.role

            },
            token,

        });



    } catch (error) {
        console.log(error)
        res.status(500).send({
            success:false,
            massage:"error in login controller",
            error
        })
    }
}
//TEST controller
export const testController = async (req,res)=>{
   try {
    console.log('protected Routes')
    res.send('protected routes')
   } catch (error) {
    console.log(error)
   }
}

//progot password controller

export const frogotPasswordController = async (req,res)=>{
        try {
            const {email,answer,newPassword} = req.body;
            if(!email){
                res.status(400).send({message:"E-mail is required "})
            }
            if(!answer){
                res.status(400).send({message:"answer is required "})
            }
            if(!newPassword){
                res.status(400).send({message:"newPassword is required "})
            }
            const user = await userModels.findOne({email,answer})

            //validation
            if(!user){
                res.status(404).send({
                    success:false,
                    message:'wrong email or answer'
                })
            }
            const hashed = await hashPassword(newPassword);
            await userModels.findByIdAndUpdate(user._id,{password:hashed});
            res.status(200).send({
                success:true,
                message:'Password reset Succesfully'
            })


        } catch (error) {
            console.log(error)
            res.status(500).send({
                success:false,
                message:"something went wrong",
                error
            })
        }    
}

//update profilr

export const updateProfileController = async (req,res) =>{
    try {
        const {name ,email,password,address,phone} =req.body
        const user = await userModels.findById(req.user._id)

        //password
        if(!password && password.length<6){
            return res.json("password must be ^ characters")
        }
        const hashedPassword =password ? await hashPassword(password):undefined
        const updatedUser = await userModels.findByIdAndUpdate(req.user._id,{
            name:name || user.name,
            password:password ||user.password,
            phone:phone ||user.phone,
            address:address ||user.address,

        },{new:true})
        res.status(200).send
        ({
            success:true,
            message:"profile updated succesfully",
            updatedUser
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success:false,
            message:"error in updating profile"
        })
    }
}


export const getOrderController = async (req, res) => {
    const userId =req.user._id;
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


