import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import restaurantRoutes from "./routes/restaurantRoutes.js";
import menuRoutes from "./routes/menuRoutes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4003;

app.use(cors());
app.use(express.json());

app.use("/api/restaurants", restaurantRoutes);
app.use("/api/menu", menuRoutes);

app.get("/", (req, res) => {
  res.send("Restaurant + Menu Service is running 🚀");
});

app.listen(PORT, () => {
  console.log(`Restaurant service running on port ${PORT}`);
});
