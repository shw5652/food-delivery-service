import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret';

export default function generateToken(payload, opts = {}){
    return jwt.sign(payload, JWT_SECRET, {expiresIn:opts.expiresIn || '1h'});
}