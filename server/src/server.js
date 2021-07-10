const express = require('express');
require('dotenv').config();

const {
  connectDb
} = require('./db/config');

const authRouter = require('./routes/auth');
const postRouter = require('./routes/post');

// connect mongdodb
connectDb();

const app = express();
const PORT = 1998;

app.use(express.json());

// use rounter
app.use('/api/auth', authRouter);
app.use('/api/posts', postRouter);

// listen port
app.listen(PORT, () => console.log(`server running on http://localhost:${PORT}/`));