import express from 'express';
import uploadRoutes from './routes/uploadRoutes';

const app = express();

app.use(express.json());
app.use('/api', uploadRoutes);

export { app };
