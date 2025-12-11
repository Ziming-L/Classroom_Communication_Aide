import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { WebSocketServer } from 'ws';
import { createServer } from 'http';

import studentRoutes from './routes/studentRoutes.js';
import teacherRoutes from './routes/teacherRoutes.js';
import authRoutes from './routes/authRoutes.js';
import translateRoutes from "./routes/translateRoutes.js";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

//web sockets
const server = createServer(app);
const wsServer = new WebSocketServer({ server });

wsServer.on('connection', socket => {
    console.log('Client connected.');

    socket.on('message', (msg) => {
        const data = JSON.parse(msg);
        //activity
        if (data.type == "activity") {
            console.log("updating activity:", data);

            wsServer.clients.forEach((client) => {
                if (client.readyState === 1) {
                    client.send(
                        JSON.stringify({
                            type: "activity",
                            payload: data.payload
                        })
                    );
                }
            });
        }
        console.log(`Received message: type: ${data.type}, message: ${data.message}`);
        broadcast(data.message);
    });

    socket.on('close', () => {
        console.log('Client disconnected.');
    });
});
// // sends message to all open clients
// function broadcast(message) {
//     for (const client of wsServer.clients) {
//         if (client.readyState === ws.OPEN) {
//             client.send(message)
//         }
//     }
// }


// Routes
app.use('/api/students', studentRoutes);
app.use('/api/teachers', teacherRoutes);
app.use('/api/auth', authRoutes);
app.use("/api/translate", translateRoutes);

app.get('/', (req, res) => {
    res.send('Classroom Communication Aide Backend is running');
})

const PORT = process.env.PORT || 5100;
server.listen(PORT, () => console.log(`Server is running on port ${PORT}`));