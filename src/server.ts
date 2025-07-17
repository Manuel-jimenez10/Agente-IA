import 'module-alias/register'
import express from 'express'
import cookieParser from 'cookie-parser';
import { initServer } from "@setup/initServer";
import { initSocketServer } from "@setup/initSocketServer";
import http from 'http'
import cors from "cors"
import videoRouter from '@routers/video.router'
import authRouter from '@routers/auth.router'
import userRouter from '@routers/user.router'
import profileRouter from '@routers/profile.router'
import streamingRouter from '@routers/streaming.router'
import whatsappRouter from '@routers/whatsapp.router'
import messageRouter from '@routers/message.router'
import droneRouter from '@routers/drone.router'

process.env.TZ = 'UTC';

const app = express();
const server = http.createServer(app);

app.use(cookieParser())
app.use(express.json());
app.use(cors());

app.use('/api/auth', authRouter);
app.use('/api/users', userRouter);
app.use('/api/profiles', profileRouter);
app.use('/api/videos', videoRouter);
app.use('/api/streaming', streamingRouter);
app.use('/api/whatsapp', whatsappRouter);
app.use('/api/messages', messageRouter);
app.use('/api/drones', droneRouter);

initServer(server);
initSocketServer(server);