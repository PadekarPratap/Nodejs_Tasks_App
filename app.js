import express from 'express'
import userRoutes from './routes/user.js'
import tasksRouter from './routes/task.js'
import { errorMiddleware } from './middleware/error.js'
import cookieParser from 'cookie-parser'
import cors from 'cors'

export const app = express()



// middlewares
app.use(express.json())
app.use(cookieParser())
app.use(cors({
    origin: [process.env.HOST_URL],
    methods: ["POST", "GET", "PUT", "DELETE"],
    credentials: true
}))

// user routes
app.use('/api/v1/users', userRoutes)
// task routes
app.use('/api/v1/tasks', tasksRouter)
// middleware for handling errors
app.use(errorMiddleware)
