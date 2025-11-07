import express from 'express';
import cors from "cors";
import { usuarioRouter } from './routes/usuarioRoute.js';
import { auth } from './middleware/auth.js';
import { authRouter } from './routes/authRoutes.js';

export const app = express();

app.use(cors()); 
app.use(express.json());


app.use('/auth', authRouter);
app.use(auth)

app.use(usuarioRouter);