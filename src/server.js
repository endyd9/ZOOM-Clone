import express from "express";
import http from "http";
import { Server } from "socket.io";
// import { WebSocketServer } from "ws";

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
const httpServer = http.createServer(app);
const wsServer = new Server(httpServer);

wsServer.on("connection", (socket) => {
  socket["nickname"] = "Someone";
  socket.onAny((event) => {
    console.log(`Socket Event : ${event}`);
  });
  socket.on("enter_room", (roomName, done) => {
    roomName = roomName.payload;
    socket.join(roomName);
    done();
    socket.to(roomName).emit("welcome", socket.nickname);
  });
  socket.on("disconnecting", () => {
    socket.rooms.forEach((room) =>
      socket.to(room).emit("bye", socket.nickname)
    );
  });
  socket.on("new_message", (msg, room, done) => {
    socket.to(room).emit("new_message", `${socket.nickname} : ${msg}`);
    done();
  });
  socket.on("nickname", (nickname) =>
    nickname === "" ? "Someone" : (socket["nickname"] = nickname)
  );
});

// const onSocketClose = () => {
//   console.log("Disconnected❌");
// };

// const sockets = [];

// ws.on("connection", (socket) => {
//   sockets.push(socket);
//   socket["nickname"] = "무명";
//   console.log("Connected!✅");
//   socket.on("close", () => onSocketClose);
//   socket.on("message", (message) => {
//     const msg = JSON.parse(message);
//     switch (msg.type) {
//       case "new_message":
//         sockets.forEach((sk) => {
//           sk.send(`${socket.nickname}: ${msg.payload}`);
//         });
//         break;
//       case "nickname":
//         socket["nickname"] = msg.payload;
//         break;
//     }
//   });
// });

httpServer.listen(port, handleListen);
