import express from "express";
import dotenv from "dotenv";
import orderRoutes from "./routes/orderRoutes.js";

dotenv.config();

const app = express();

app.use(express.json());

app.use("/api/orders", orderRoutes);

app.get("/", (req, res) => {
    res.send("Order service is running");
})

const PORT = process.env.PORT || 4004;

app.listen(PORT, () =>{
    console.log(`Order service running on port ${PORT}`);
});