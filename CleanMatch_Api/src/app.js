import express from 'express';
import cors from "cors";
import { usuarioRouter } from './routes/usuarioRoute.js';
// import { auth } from './middleware/auth.js';
import { authRouter } from './routes/authRoutes.js';
import { swaggerDocs } from "./config/swaggerConfig.js";

export const app = express();

app.use(cors()); 
app.use(express.json());

swaggerDocs(app);   
app.use('/auth', authRouter);

app.use(usuarioRouter);