const express = require('express');
const http = require('http');
const { WebSocketServer } = require('ws');

const app = express();
const server = http.createServer(app);
const port = process.env.PORT || 3000

app.get('/', (req, res) => {
  res.json({
    message: 'Hello, world!',
  })
})

const wss = new WebSocketServer({ clientTracking: false, noServer: true });

function onSocketError(err) {
  console.error(err);
}

server.on('upgrade', function (request, socket, head) {
  socket.on('error', onSocketError);

  console.log('Parsing session from request...');
  wss.handleUpgrade(request, socket, head, function (ws) {
    wss.emit('connection', ws, request);
  });
});

wss.on('connection', function (ws, request) {

  ws.on('error', console.error);

  ws.on('message', function (message) {
    //
    // Here we can now use session parameters.
    //
    console.log(`Received message ${message} from user`);
  });

  ws.on('close', function () {
    // map.delete(userId);
  });
});

//
// Start the server.
//
server.listen(port, function () {
  console.log(`Listening on http://localhost:${port}`);
});

// const express = require('express')
// const cors = require('cors')
// const { createServer } = require("http");
// const { Server } = require("socket.io");

// const app = express();
// app.use(cors())
// const httpServer = createServer(app);
// const io = new Server(httpServer, {
//   // allowRequest: (req, callback) => {
//   //   const noOriginHeader = req.headers.origin === undefined;
//   //   callback(null, noOriginHeader); // only allow requests without 'origin' header
//   // }
// });


// io.on('connection', (socket) => {
//   socket.emit("hello", "world");
// });
// // const port = process.env.PORT || 3000

// app.get('/', (req, res) => {
//   res.json({
//     message: 'Hello, world!',
//   })
// })

// // // app.listen(port, () => {
// // //   console.log(`App listening at http://localhost:${port}`)
// // // })
// httpServer.listen(3000);

// // const { Server } = require("socket.io");
// // const { createServer } = require("http");
// // const httpServer = createServer();
// // const io = new Server(httpServer, {
// //   cors: {
// //     // origin: "http://localhost:3000",
// //     // allowRequest: (req, callback) => {
// //     //   const noOriginHeader = req.headers.origin === undefined;
// //     //   callback(null, noOriginHeader); // only allow requests without 'origin' header
// //     // },
// //     // allowedHeaders: ["my-custom-header"],
// //     // credentials: true
// //   }
// // });

// // const { Server } = require("socket.io");

// // const io = new Server();

// // io.on("connection", (socket) => {
// //   socket.emit('hello', 'world');
// //   // ...
// // });

// // io.listen(3000);