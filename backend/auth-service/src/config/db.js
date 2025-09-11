import pkg from "pg";
const {Pool} = pkg;

import dotenv from "dotenv";
dotenv.config();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false} : false,
    max: parseInt(process.env.DB_MAX_CLIENTS) || 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
});

export default pool;