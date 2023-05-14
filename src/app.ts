import "reflect-metadata";
import express from "express";
import productRoutes from "./routes/product.routes";
import packRoutes from "./routes/pack.routes";

const app = express();

app.use(express.json());

app.use("/product", productRoutes);
app.use("/pack", packRoutes);

export default app;
