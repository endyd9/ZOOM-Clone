const socket = io();

const welcome = document.querySelector("#welcome");
const form = welcome.querySelector("form");
const room = document.querySelector("#room");

room.hidden = true;

let roomName;

const addMessage = (message) => {
  const ul = room.querySelector("ul");
  const li = document.createElement("li");
  li.innerText = message;
  ul.appendChild(li);
};

const handleMessageSubmit = (event) => {
  event.preventDefault();
  const input = room.querySelector("#msg > input");
  socket.emit("new_message", input.value, roomName, () => {
    addMessage(`You : ${input.value}`);
    input.value = "";
  });
};

const showRoom = () => {
  welcome.hidden = true;
  room.hidden = false;
  const h3 = room.querySelector("h3");
  h3.innerText = `Room ${roomName}`;
  const msgForm = room.querySelector("#msg");
  msgForm.addEventListener("submit", handleMessageSubmit);
};

const handleRoomSubmit = (event) => {
  event.preventDefault();
  const room = form.querySelector("#roomName");
  const nickName = form.querySelector("#nickName");
  socket.emit("nickname", nickName.value);
  socket.emit("enter_room", { payload: room.value }, showRoom);
  roomName = room.value;
  nickName.value = "";
  room.value = "";
};

form.addEventListener("submit", handleRoomSubmit);

socket.on("welcome", (user) => {
  addMessage(`${user} Joined`);
});
socket.on("bye", (left) => {
  addMessage(`${left} levaed`);
});
socket.on("new_message", addMessage);
