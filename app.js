const express = require('express');
const session = require('express-session');
const http = require('http');
const { WebSocketServer } = require('ws');
const uuid = require('uuid');

const app = express();
const port = process.env.PORT || 3000;
const map = new Map();

const sessionParser = session({
  saveUninitialized: false,
  secret: '$eCuRiTy',
  resave: false
});

app.use(express.static('public'));
app.use(sessionParser);

app.post('/login', function (req, res) {
  //
  // "Log in" user and set userId to session.
  //
  const id = uuid.v4();

  console.log(`Updating session for user ${id}`);
  req.session.userId = id;
  res.send({ result: 'OK', message: 'Session updated' });
});

app.post('/logout', function (request, response) {
  const ws = map.get(request.session.userId);

  console.log('Destroying session');
  request.session.destroy(function () {
    if (ws) ws.close();

    response.send({ result: 'OK', message: 'Session destroyed' });
  });
});

app.get('/', (req, res) => {
  res.json({
    message: 'Hello, world!',
  })
})

const server = http.createServer(app);
const wss = new WebSocketServer({ clientTracking: false, noServer: true });


function onSocketError(err) {
  console.error(err);
}

server.on('upgrade', function (request, socket, head) {
  socket.on('error', onSocketError);

  console.log('Parsing session from request...');

  sessionParser(request, {}, () => {
    if (!request.session.userId) {
      socket.write('HTTP/1.1 401 Unauthorized\r\n\r\n');
      socket.destroy();
      return;
    }

    console.log('Session is parsed!');

    socket.removeListener('error', onSocketError);

    wss.handleUpgrade(request, socket, head, function (ws) {
      wss.emit('connection', ws, request);
    });
  });
  // wss.handleUpgrade(request, socket, head, function (ws) {
  //   wss.emit('connection', ws, request);
  // });
});

wss.on('connection', function (ws, request) {
  const userId = request.session.userId;
  map.set(userId, ws);
  ws.on('error', console.error);

  ws.on('message', function (message) {
    //
    // Here we can now use session parameters.
    //
    // ws.send(`Your message ${message}`);
    console.log(`Received message ${message} from user ${userId}`);
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