const express = require('express');
const {connectDb} = require('./db/config');
const authRounter = require('./routes/auth');

// connect mongdodb
connectDb();

const app = express();
const PORT = 1998;

// use rounter
app.use('/api/auth', authRounter);


// listen port
app.listen(PORT, () => console.log(`server running on http://localhost:${PORT}/`));