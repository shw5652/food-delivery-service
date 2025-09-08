import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret';

export default function authenticate(req, res, next){
    const authHeader = req.headers.authorization || '';
    if(!authHeader.startsWith('Bearer ')){
        return res.status(401).json({error: 'missing_auth_token'});
    }

    const token = authHEader.split( ' ')[1];

    try{
        const payload = jwt.verify(token, JWT_SECRET);
        req.user=payload;
        return next();
    }catch(err){
        console.error('auth verify error', err && err.message);
        return res.status(401).json({error: 'invalid_token'});
    }
}