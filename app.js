const express = require('express')
const app = express()
const server = require('http').createServer(app);
const io = require('socket.io')(server);
io.on('connection', (socket) => {
  socket.emit("hello", "world");
});
const port = process.env.PORT || 3000

app.get('/', (req, res) => {
  res.json({
    message: 'Hello, world!',
  })
})

// app.listen(port, () => {
//   console.log(`App listening at http://localhost:${port}`)
// })
server.listen(port);