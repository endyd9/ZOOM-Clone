import express from "express";
import path from "path";

const app = express();

const port = 3000;

app.set("view engine", "pug");
app.set("views", process.cwd() + "/src/views");

const handleListen = () => {
  console.log(`server on port ${port}`);
};
app.use("/public", express.static(process.cwd() + "/src/public/"));
app.get("/", (req, res) => res.render("home"));

app.listen(port, handleListen);
