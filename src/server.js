import express from "express";
import http from "http";
import { WebSocketServer } from "ws";

const app = express();

const port = 3000;

app.set("view engine", "pug");
app.set("views", process.cwd() + "/src/views");
app.use("/public", express.static(process.cwd() + "/src/public/"));
app.get("/", (req, res) => res.render("home"));
app.get("/*", (req, res) => res.redirect("/"));

const handleListen = () => {
  console.log(`server on port ${port}`);
};
const server = http.createServer(app);
const ws = new WebSocketServer({ server });

const onSocketClose = () => {
  console.log("Disconnected❌");
};

const sockets = [];

ws.on("connection", (socket) => {
  sockets.push(socket);
  socket["nickname"] = "무명";
  console.log("Connected!✅");
  socket.on("close", () => onSocketClose);
  socket.on("message", (message) => {
    const msg = JSON.parse(message);
    switch (msg.type) {
      case "new_message":
        sockets.forEach((sk) => {
          sk.send(`${socket.nickname}: ${msg.payload}`);
        });
        break;
      case "nickname":
        socket["nickname"] = msg.payload;
        break;
    }
  });
});

server.listen(port, handleListen);
