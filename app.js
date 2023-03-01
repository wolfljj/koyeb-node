const express = require('express')
const { createServer } = require("http");
const { Server } = require("socket.io");

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, { /* options */ });


io.on('connection', (socket) => {
  socket.emit("hello", "world");
});
// const port = process.env.PORT || 3000

// app.get('/', (req, res) => {
//   res.json({
//     message: 'Hello, world!',
//   })
// })

// app.listen(port, () => {
//   console.log(`App listening at http://localhost:${port}`)
// })
httpServer.listen(3000);

// const { Server } = require("socket.io");
// const { createServer } = require("http");
// const httpServer = createServer();
// const io = new Server(httpServer, {
//   cors: {
//     // origin: "http://localhost:3000",
//     // allowRequest: (req, callback) => {
//     //   const noOriginHeader = req.headers.origin === undefined;
//     //   callback(null, noOriginHeader); // only allow requests without 'origin' header
//     // },
//     // allowedHeaders: ["my-custom-header"],
//     // credentials: true
//   }
// });

// const { Server } = require("socket.io");

// const io = new Server(3000);

// io.on("connection", (socket) => {
//   socket.emit('hello', 'world');
//   // ...
// });

// io.listen(3000);