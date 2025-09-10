// src/server.js
import express from "express";
import dotenv from "dotenv";
import paymentRoutes from "./routes/paymentRoutes.js";

dotenv.config();
const app = express();

app.use(express.json());
app.use("/payments", paymentRoutes);

const PORT = process.env.PORT || 4006;
app.listen(PORT, () => {
  console.log(`Payment service running on port ${PORT}`);
});
