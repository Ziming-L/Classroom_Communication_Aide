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

//students and teacher lists
const studentMap = {};
const teacherMap = {};

wsServer.on('connection', socket => {
    console.log('Client connected.');

    socket.on('message', (msg) => {
        let data;
        // error handling for invalid message
        try {
            data = JSON.parse(msg)
        } catch (e) {
            console.log("invalid JSON message", e);
            return;
        }

        const { type, payload } = data;

        if (type === "register") {
            socket.role = payload.role;
            socket.classId = payload.classId;
            socket.classCode = payload.classCode;
            console.log(`Registered ${socket.role} for class ${socket.classId} - ${socket.classCode}: ${new Date().toLocaleString()}`);
            return;
        }

        if (type === "activity") {
            broadcast(socket.classId, socket.classCode, {
                type: "activity",
                payload
            });
            return;
        }
        if (type === "student-message") {
            broadcast(socket.classId, socket.classCode, {
                type: "student-message",
                payload

            });
            return;
        }
        if (type === "teacher-message") {
            broadcast(socket.classId, socket.classCode, {
                type: "teacher-message",
                payload

            });
            return;
        }
        if (type === "refresh-requests") {
            broadcast(socket.classId, socket.classCode, {
                type: "refresh-requests",
                payload
            });
            return;
        }
        if (type === "request-allowed-button") {
            broadcast(socket.classId, socket.classCode, {
                type: "request-allowed-button",
                payload
            });
            return;
        }
    });

    socket.on('close', () => {
        console.log('Client disconnected.');
    });
});

// sends message to all open clients
function broadcast(classId, classCode, message) {
    wsServer.clients.forEach(client => {
        if (client.readyState === ws.OPEN && client.classId === classId && client.classCode === classCode) {
            client.send(JSON.stringify(message));
        }
    });
}


// Routes
app.use('/api/students', studentRoutes);
app.use('/api/teachers', teacherRoutes);
app.use('/api/auth', authRoutes);
app.use("/api/translate", translateRoutes);

app.get('/', (_, res) => {
    res.send('Classroom Communication Aide Backend is running');
})

const PORT = process.env.PORT || 5100;
server.listen(PORT, () => console.log(`Server is running on port ${PORT}`));