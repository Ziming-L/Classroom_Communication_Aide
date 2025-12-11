import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import ws, { WebSocketServer } from 'ws';
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
        //error handling for invalid json

        if (data.type == "activity") {
            broadcast(JSON.stringify({
                type: "activity",
                payload: data.payload
            }));
            return;
        }
        if (data.type == "message") {
            //NOT IMPLEMENTED YET
            return;
        }
    });

    socket.on('close', () => {
        console.log('Client disconnected.');
    });
});

// sends message to all open clients
function broadcast(message) {
    wsServer.clients.forEach(client => {
        if (client.readyState === ws.OPEN) {
            client.send(message)
        }
    });
}


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