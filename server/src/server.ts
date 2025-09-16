// server.ts
import dotenv from 'dotenv';
dotenv.config();  // must come first!

import mongoose from 'mongoose';
import app from './app';

const PORT = process.env.PORT || 5000;
const MONGO = process.env.MONGO_URI || 'mongodb://localhost:27017/task_encryption_demo';

mongoose.connect(MONGO)
  .then(() => {
    console.log('Mongo connected');
    app.listen(PORT, () => console.log('Server listening on', PORT));
  })
  .catch(err => {
    console.error('Mongo connection error', err);
  });
