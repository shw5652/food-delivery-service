import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "dev-secret";

export const verifyToken = (req, res, next) =>{
    const authHeader = req.headers["authorization"];
    if(!authHeader){
        return res.status(401).json({error: "Missing token"});
    }

    const token = authHeader.split(" ")[1];

    jwt.verify(token, JWT_SECRET, (err, decoded) => {
        if(err){
            return res.status(403).json({error: "Invalid token"});
        }
        req.user = decoded;
        next();
    });
};