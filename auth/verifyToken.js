import jwt from "jsonwebtoken";
import User from "../models/UserSchema.js";
import Doctor from "../models/DoctorSchema.js";

export const authenticate = async (req, res, next) => {
    const authToken = req.headers.authorization;

    if (!authToken || !authToken.startsWith("Bearer ")) {
        return res
            .status(401)
            .json({ success: false, message: "No token, authorization denied" });
    }

    try {
        const token = authToken.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        req.userId = decoded.id;  // Changed to camelCase
        req.role = decoded.role;
        next();
    } catch (error) {
        if (error.name === 'TokenExpiredError') {  // Fixed capitalization
            return res.status(401).json({ success: false, message: "Token expired" });
        }
        return res.status(401).json({ success: false, message: "Invalid token" });
    }
};

export const restrict = roles => async (req, res, next) => {
    const userRole = req.role;

    if (!userRole) {
        return res.status(401)
            .json({ success: false, message: "User role not found" });
    }

    if (!roles.includes(userRole)) {
        return res.status(403) 
            .json({ success: false, message: "You're not authorized" });
    }

    next();
};