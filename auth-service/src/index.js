import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4001;

app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => res.json({
    status: 'ok'
}));
app.use("/api/auth", authRoutes);

app.listen(PORT, () => {
    console.log('Auth service running on http://localhost:${PORT}');
});