import jwt from 'jsonwebtoken';
import userModels from '../models/userModels.js';

// Protected Routes token base
export const requireSignIn = async (req, res, next) => {
    try {
        const token = req.headers.authorization;
        if (!token) {
            return res.status(401).send({
                success: false,
                message: 'Token not provided'
            });
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        console.log(error);
        return res.status(401).send({
            success: false,
            message: 'Invalid token'
        });
    }
};

// Admin access
export const isAdmin = async (req, res, next) => {
    try {
        const user = await userModels.findById(req.user._id);
        if (!user || user.role !== 1) {
            return res.status(401).send({
                success: false,
                message: 'Unauthorized access'
            });
        } else {
            next();
        }
    } catch (error) {
        console.log(error);
        return res.status(401).send({
            success: false,
            message: 'Error in admin middleware'
        });
    }
};
