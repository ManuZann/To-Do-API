import { config } from "dotenv";
config()

import express from "express"
const app = express()


import authRouter from "./routes/authRoutes";
import toDoRouter from "./routes/toDoRoutes";


app.use(express.json())


app.use("/auth", authRouter)
app.use("/todos", toDoRouter)

export default app