// app.ts
import express from 'express';
import cors from 'cors';
import studentRoutes from './routes/studentRoutes';

const app = express();
app.use(cors());
app.use(express.json({ limit: '5mb' }));

app.use('/api', studentRoutes);

app.get('/', (req, res) => res.send('Server running'));

export default app;
