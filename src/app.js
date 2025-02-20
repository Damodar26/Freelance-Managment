import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import projectRoutes from "./routes/projectRoutes.js";
import taskRoutes from "./routes/taskRoutes.js";

const app = express()

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))

app.use(express.json({limit: "16kb"}))
app.use(express.urlencoded({extended: true, limit: "16kb"}))
app.use(express.static("public"))
app.use(cookieParser())

//Routes import

import userRouter from './routes/user.routes.js';

//Routes declaration

app.use("/api/v1/users", userRouter);
app.use("/api/projects", projectRoutes);
app.use("/api/tasks", taskRoutes);

export {app}

