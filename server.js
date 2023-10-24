const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
const port = 5001;

app.use(express.json());

// instruction: setup cors
const corsHandler = cors({
  origin: "*",
  methods: "GET,POST,PUT,DELETE",
  allowedHeaders: ["Content-Type", "Authorization"],
  optionsSuccessStatus: 200,
  preflightContinue: true,
});

app.use(corsHandler);

// instruction: setup MongoDB Connection
mongoose
  .connect("mongodb://127.0.0.1:27017/bookLibrary")
  .then(() => console.log("MongoDB Connected Success..."))
  .catch((error) => console.log(error));

// instruction: setup routes
const authorsRouter = require("./routes/authors");
const booksRouter = require("./routes/books");

app.use("/authors", authorsRouter);
app.use("/books", booksRouter);

app.get("/", (req, res) => {
  res.send("Good luck with the exam!");
});

// Server listening
app.listen(port, () => console.log(`Server started on port ${port}`));
