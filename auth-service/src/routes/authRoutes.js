import express from 'express';

const router = express.Router();

router.post('/signup', (req, res) =>{
    res.json({message: 'signup endpoint - implement controller'});
});

router.post('/login', (req, res)=>{
    res.json({message: 'login endpoint - implement controller'});
});

export default router;