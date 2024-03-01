const http = require("http");
const express = require("express");
const app = express();
const mongoose = require('mongoose');
const usersRouter = require("./routes/userRoutes.js")
const blogsRouter = require("./routes/blogRoutes")
const dotenv = require("dotenv")
const { connect } = require("./db");
const cors = require('cors');

app.use(cors());

app.use(express.json())
dotenv.config({ path: './config.env' })

app.use(express.static('public'));


app.get("/", (req, res) => {
  console.log("Hello", req.url);
  res.send("Welcome")
})

app.use("/user", usersRouter)
app.use("/blogs", blogsRouter);

app.use((req, res, next) => {
  res.header('Access-Control-Expose-Headers', 'Authorization');
  next();
});


connect()

app.listen(process.env.PORT, () => {
  console.log("Hello");
})