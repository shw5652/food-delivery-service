import express from "express";
import dotenv from "dotenv";
import deliveryRoutes from "./routes/deliveryRoutes.js";

dotenv.config();
const app = express();

app.use(express.json());

app.get("/", (req, res) => res.send("Delivery Service is running"));

app.use("/deliveries", deliveryRoutes);

const PORT = process.env.PORT || 4007;
app.listen(PORT, () => {
  console.log(`Delivery Service running on port ${PORT}`);
});
