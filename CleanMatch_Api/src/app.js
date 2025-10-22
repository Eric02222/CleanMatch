import express from 'express';
import cors from "cors";
import { usuarioRouter } from './routes/usuarioRoute';
import { auth } from './middleware/auth';

const app = express();

app.use(cors()); 
app.use(express.json());


app.use('/auth', authRouter);
app.use(auth)

app.use(usuarioRouter);