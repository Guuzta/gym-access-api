import express from "express";
import cookieParser from "cookie-parser";

import healthRoutes from "./routes/healthRoutes";
import adminRoutes from "./routes/adminRoutes";
import authRoutes from "./routes/authRoutes";
import accessRoutes from "./routes/accessRoutes";

import errorHandler from "./middlewares/errorHandler";

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use("/", healthRoutes);
app.use("/admin", adminRoutes);
app.use("/auth", authRoutes);
app.use("/access", accessRoutes);

app.use(errorHandler);

export default app;
