import express from 'express';
import cors from "cors";
import helmet from "helmet";
import { usuarioRouter } from './routes/usuarioRoute.js';
import { authRouter } from './routes/authRoutes.js';
import { swaggerDocs } from "./config/swaggerConfig.js";
import { errorHandler } from './middleware/errorHandler.js';

export const app = express();

app.use(helmet());
app.use(cors()); 
app.use(express.json());

swaggerDocs(app);   
app.use('/auth', authRouter);
app.use(usuarioRouter);

// Global error handler must be the last middleware
app.use(errorHandler);