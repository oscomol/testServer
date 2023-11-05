require('dotenv').config();
const express = require('express');
const cors = require("cors");
const bodyParser = require('body-parser');
const socketController = require("./controllers/socketController");
const http = require('http');
const PORT = process.env.port || 3600
const { Server } = require("socket.io");
const { savePh } = require("./controllers/phController")
const pushNotification = require("./controllers/pushNotification")
const errorHandler = require("./middleware/errorHandler");
const {
  v4 : uuidv4,
  parse:uuidParse,
  stringify : uuidStringify
} = require('uuid')

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  },
});

app.use(cors());

app.use(bodyParser.json());
app.use(bodyParser.text());

socketController(io)

app.use('/ph', require('./route/phRoute'));
app.use('/token', require('./route/tokenRoute'));

app.post('/test', (req, res) => {
  const message = req.body;
  const phData = Number(message);
  if(phData){
    pushNotification(phData);
    const phId = uuidv4();
    const parsedId = uuidParse(phId)
    const stringfyId = uuidStringify(parsedId) + new Date().toLocaleString('en-PH');
    const data = {ph: phData, id: stringfyId, date: new Date().toLocaleString('en-PH');
    io.emit('to-user', data);
    savePh(phData, res)
  }else{
    res.status(200).send("Success")
  }
  
});

app.use(errorHandler);

server.listen(PORT, () => {
  console.log(`Server running`);
  
});
