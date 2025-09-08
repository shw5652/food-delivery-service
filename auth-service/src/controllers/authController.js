import pool from '../config/db.js';
import bcrypt from 'bcrypt';
import generateToken from '../utils/generateToken.js';

export async function signup(req, res){
    try{
        const {name, email, password} = req.body || {};
        if(!email || !password){
            return res.status(400).json({error: 'email and password are required'});
        }

        const normalizesEmail = email.toLowerCase().trim();

        const {rows:existing} = await pool.query(
            'SELECT id FROM app_auth.users WHERE email = $1',
            [normalizesEmail]
        );
        if(existing.length > 0){
            return res.status(409).json({ error: 'email already in use'});
        }

        const password_hash = await bcrypt.hash(password, 10);

        const {rows} = await pool.query(
            'INSERT INTO app_auth.users (name, email, password_hash) VALUES ($1, $2, $3) RETURNING id, name, email, created_at', [name || null, normalizesEmail, password_hash]
        );

        const user = rows[0];
        return res.status(201).json({user});
    }
    catch(err){
        console.error('signup error', err);
        return res.status(500).json({ error: 'internal_server_error'});
    }
}

export async function login(req, res){
    try{
        const {email, password} = req.body 
        || {};
        if(!email || !password){
            return res.status(400).json({error: 'email and password required'});
        }

        const normalizesEmail = email.toLowerCase().trim();

        const {rows} = await pool.query(
            'SELECT id, email, name, password_hash FROM app_auth.users WHERE email = $1', [normalizesEmail]
        );

        if(rows.length === 0){
            return res.status(401).json({ error: 'invalid_credentials'});
        }

        const user = rows[0];
        const match = await bcrypt.compare(password, user.password_hash);

        if(!match){
            return res.status(401).json({error: 'invalid_credentials'});
        }

        const token = generateToken({ sub:user.id, email: user.email}, {expiresIn: '8h'});
        return res.json({accessToken: token});
    }
    catch(err){
        console.error('login error', err);
        return res.status(500).json({error: 'internal_server_error'});
    }
}

export async function currUser(req, res){
    try{
        const userId = req.user && req.user.sub;
        if(!userId) {
            return res.status(401).json({error: 'unauthenticated'});
        }

        const {rows} = await pool.query(
            'SELECT id, name, email, created_at FROM app_auth.users WHERE id=$1', [userId]
        );

        if(rows.length === 0){
            return res.status(404).json({error: 'user_not_found'});
        }

        return res.json(rows[0]);
    }
    catch(err){
        console.error('curr_user error', err);
        return res.status(500).json({error: 'internal_server_error'});
    }
}