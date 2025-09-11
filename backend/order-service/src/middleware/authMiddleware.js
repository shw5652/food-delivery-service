import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || "dev-secret";

export const verifyToken = ( req, res, next) =>{
    const authHeader = req.headers["authorization"];

    if(!authHeader || !authHeader.startswith("Bearer ")){
        return res.status(401).json({ error: "No token provided"});
    }

    const token = authHeader.split(" ")[1];

    try{
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        next();
    }
    catch(err){
        return res.status(401).json({error: "Invalid or expired token"});
    }
};