import express from 'express'
import dotenv from "dotenv"
import {connectDB} from '../src/lib/db.js'
import cookieParser from 'cookie-parser'


import authRoutes from './routes/auth.route.js'

  dotenv.config()


const app = express();

app.use(express.json());



app.use(cookieParser());
app.use("/api/auth",authRoutes)

const port = process.env.PORT

app.use(express.urlencoded({ extended: true }));

app.listen(port,()=>{console.log(`server is running on port : ${port}` )
connectDB()
}) 