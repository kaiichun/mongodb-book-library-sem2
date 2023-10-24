const express = require("express");
const router = express.Router();

// instruction: import the book model
const Book = require("../models/book");

// instruction: import the review model
const Review = require("../models/review");

/* 
  instruction: 
  - setup GET /: Get all books (use populate() to get author details)
	- Filter books by genre or/and title
  - For instance, if a user wants to filter books by genre, the user can send a GET request to /books?genre=Mystery
*/
router.get("/", async (request, response) => {
  try {
    const { genre, title } = request.query;
    let filter = {};
    if (genre || title) {
      if (genre) {
        filter.genre = genre;
      }
      if (title) {
        filter.title = title;
      }
    }
    const books = await Book.find(filter).populate("author").sort({ _id: -1 });
    response.status(200).send(books);
  } catch (error) {
    response.status(400).send({ message: error.message });
  }
});

// instruction: setup GET /:id: Get a specific book by its _id (use populate() to get author details)
router.get("/:id", async (request, response) => {
  try {
    const book = await Book.findOne({ _id: request.params.id }).populate(
      "author"
    );
    response.status(200).send(book);
  } catch (error) {
    response.status(400).send({ message: error.message });
  }
});

// instruction: setup POST /: Add a new book
router.post("/", async (request, response) => {
  try {
    const newBook = new Book({
      title: request.body.title,
      author: request.body.author,
      publishedDate: request.body.publishedDate,
      genre: request.body.genre,
      summary: request.body.summary,
    });
    await newBook.save();
    response.status(200).send(newBook);
  } catch (error) {
    response.status(400).send({ message: error.message });
  }
});

// instruction: setup PUT /:id: Update a book by its _id
router.put("/:id", async (request, response) => {
  try {
    const bookID = request.params.id;

    const updatedBook = await Book.findByIdAndUpdate(
      bookID,
      {
        title: request.body.title,
        author: request.body.author,
        publishedDate: request.body.publishedDate,
        genre: request.body.genre,
        summary: request.body.summary,
      },
      { new: true }
    );
    response.status(200).send(updatedBook);
  } catch (error) {
    response.status(400).send({ message: error.message });
  }
});

// instruction: setup DELETE /:id: Delete a book by its _id
router.delete("/:id", async (request, response) => {
  try {
    const bookID = request.params.id;
    const deleteBook = await Book.findByIdAndDelete(bookID);
    response
      .status(200)
      .send({ message: "Book title (" + deleteBook.title + ") is deleted" });
  } catch (error) {
    response.status(400).send({ message: error.message });
  }
});

// instruction: setup GET /:id/reviews: Get all reviews for a book by its _id
router.get("/:id/reviews", async (request, response) => {
  try {
    const reviews = await Review.find({
      book: request.params.id,
    }).sort({ _id: -1 });
    response.status(200).send(reviews);
  } catch (error) {
    response.status(400).send({ message: error.message });
  }
});

// instruction: setup POST /:id/reviews: Add a review for a book using the book's _id
router.post("/:id/reviews", async (request, response) => {
  try {
    const bookID = request.params.id;
    const newReview = new Review({
      book: bookID,
      reviewerName: request.body.reviewerName,
      rating: request.body.rating,
      comment: request.body.comment,
    });
    await newReview.save();
    response.status(200).send(newReview);
  } catch (error) {
    response.status(400).send({ message: error._message });
  }
});

// instruction: export the router
module.exports = router;
