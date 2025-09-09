import express from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import cors from "cors";
import userRoutes from "./routes/userRoutes.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => res.json({
    status: 'ok'
}));

app.use(bodyParser.json());

app.use("/api/user", userRoutes);

const PORT = process.env.PORT || 4002;
app.listen(PORT, () =>{
    console.log(`User service running on http://localhost:${PORT}`);
});