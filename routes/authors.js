const express = require("express");
const router = express.Router();

// instruction: import the author model
const Author = require("../models/author");

// instruction: GET /: List all authors
router.get("/", async (request, response) => {
  try {
    const { name } = request.query;
    let filter = {};
    if (name) {
      filter.name = name;
    }
    const authors = await Author.find(filter).sort({ _id: -1 });
    response.status(200).send(authors);
  } catch (error) {
    response.status(400).send({ message: error.message });
  }
});

// instruction: setup GET /:id: Get a specific author by its _id
router.get("/:id", async (request, response) => {
  try {
    const author = await Author.findOne({ _id: request.params.id });
    response.status(200).send(author);
  } catch (error) {
    response.status(400).send({ message: error.message });
  }
});

// instruction: setup POST /: Add a new author
router.post("/", async (request, response) => {
  try {
    const newAuthor = new Author({
      name: request.body.name,
      biography: request.body.biography,
      dob: request.body.dob,
    });
    await newAuthor.save();
    response.status(200).send(newAuthor);
  } catch (error) {
    response.status(400).send({ message: error.message });
  }
});

// instruction: setup PUT /:id: Update a author by its _id
router.put("/:id", async (request, response) => {
  try {
    const authorID = request.params.id;

    const updatedAuthor = await Author.findByIdAndUpdate(
      authorID,
      {
        name: request.body.name,
        biography: request.body.biography,
        dob: request.body.dob,
      },
      { new: true }
    );
    response.status(200).send(updatedAuthor);
  } catch (error) {
    response.status(400).send({ message: error.message });
  }
});

// instruction: setup DELETE /:id: Delete a author by its _id
router.delete("/:id", async (request, response) => {
  try {
    const authorID = request.params.id;
    const deleteAuthor = await Author.findByIdAndDelete(authorID);
    response
      .status(200)
      .send({ message: "Author (" + deleteAuthor.name + ") is deleted" });
  } catch (error) {
    response.status(400).send({ message: error.message });
  }
});

// instruction: export the router
module.exports = router;
