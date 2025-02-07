import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import './db/db.js'
import path from 'path'
// import transactionRoutes from './routes/transactionRoutes.js';

import transactionRoutes from './routes/transactionRoutes.js'

// const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();
dotenv.config();
app.use(express.json())
app.use(cors());
// app.use(express.static(path.join(__dirname, "build")));





app.get('/', (req, res) => {
    res.send('hello from server');
})


app.use('/api', transactionRoutes);
app.listen(5001, () => {
    console.log(`server started at port 5001`);
})