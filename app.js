const express = require('express');
const app = express();

app.listen(7777);

// const channel = require('./routes/channel-demo');
const userRouter = require('./routes/user-demo');

app.use('/', userRouter);