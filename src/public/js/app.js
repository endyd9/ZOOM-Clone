const ul = document.querySelector("ul");
const msgForm = document.querySelector("#msg");
const nickForm = document.querySelector("#nick");
const ws = new WebSocket(`ws://${window.location.host}`);

ws.addEventListener("open", () => {
  console.log("Connected✅");
});

ws.addEventListener("message", (message) => {
  const li = document.createElement("li");
  li.innerText = `${message.data}`;
  ul.appendChild(li);
});

ws.addEventListener("close", () => {
  console.log("disconnected❌");
});

const makeMessage = (type, payload) => {
  const msg = { type, payload };
  return JSON.stringify(msg);
};

nickForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const nick = nickForm.querySelector("input");
  ws.send(makeMessage("nickname", nick.value));
  nick.value = "";
  nickForm.querySelector("button").innerText = "Change name";
});

msgForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const message = msgForm.querySelector("input");
  ws.send(makeMessage("new_message", message.value));
  message.value = "";
});
