import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
// import studentRoutes from './routes/studentRoutes.js';
// import teacherRoutes from './routes/teacherRoutes.js';
import authRoutes from './routes/authRoutes.js';
import translateRoutes from "./routes/translateRoutes.js";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

// Routes
// app.use('/api/students', studentRoutes);
// app.use('/api/teachers', teacherRoutes);
app.use('/api/auth', authRoutes);
app.use("/api/translate", translateRoutes);

app.get('/', (req, res) => {
    res.send('Classroom Communication Aide Backend is running');
})

const PORT = process.env.PORT || 5100;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));