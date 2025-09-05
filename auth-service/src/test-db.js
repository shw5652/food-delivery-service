import dotenv from "dotenv";
dotenv.config();

import pool from './config/db';

(async function test(){
    try{
        const res = await pool.query(
            "SELECT now() AS now"
        );
        console.log("Connected to DB. Server time: ", res.rows[0].now);
    }
    catch(err){
        console.error("DB connection error: ", err.message);
    }
    finally{
        await pool.end();
    }
})();