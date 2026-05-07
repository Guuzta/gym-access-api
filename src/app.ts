import express from "express";

import healthRoutes from "./routes/healthRoutes";
import adminRoutes from "./routes/adminRoutes";

import errorHandler from "./middlewares/errorHandler";

const app = express();

app.use(express.json());
app.use("/", healthRoutes);


app.use(errorHandler);

export default app;
