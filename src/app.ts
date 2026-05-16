import express from "express";
import cookieParser from "cookie-parser";

import healthRoutes from "./routes/healthRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import accessRoutes from "./routes/accessRoutes.js";

import errorHandler from "./middlewares/errorHandler.js";

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use("/", healthRoutes);
app.use("/admin", adminRoutes);
app.use("/auth", authRoutes);
app.use("/access", accessRoutes);

app.use(errorHandler);

export default app;
