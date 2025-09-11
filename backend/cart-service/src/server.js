import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cartRoutes from "./routes/cartRoutes.js";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/cart", cartRoutes);

app.get("/", (req, res) => res.send("Cart Service running"));

const PORT = process.env.PORT || 4005;
app.listen(PORT, () => {
  console.log(`Cart service listening on port ${PORT}`);
});
