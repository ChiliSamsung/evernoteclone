const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const PORT = process.env.PORT || 5000;

const app = express();

//allows client to send application/x-www-form-urlencoded in request body
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
//allows client to send JSON in request body
app.use(express.json());

//will change later when we put on heroku
mongoose.connect("mongodb://127.0.0.1:27017/notesDB");

const NoteSchema = new mongoose.Schema({
  title: String,
  content: String,
});

const UserSchema = new mongoose.Schema({
  username: {
    required: true,
    type: String,
  },
  password: {
    required: true,
    type: String,
  },
  notes: [NoteSchema],
});

const User = mongoose.model("User", UserSchema);
const Note = mongoose.model("Note", NoteSchema);

//register new user
app.post("/register", (req, res) => {
  const newUser = new User({
    username: req.body.username,
    password: req.body.password,
  });

  newUser.save((err) => {
    if (err) {
      console.log(err);
      res.status(500);
      res.send(`Got an error while trying to save user ${err}`);
    } else {
      res.status(200);
      res.send(`Successfully saved new user with name ${newUser.username}`);
    }
  });
});

//see if user exists with these credentials. Returns _id of user
app.get("/login", (req, res) => {
  console.log(req.query);
  User.findOne(
    {
      username: req.query.username,
      password: req.query.password,
    },
    function (err, foundUser) {
      if (foundUser) {
        res.send(JSON.stringify(foundUser._id));
      } else {
        res.send(JSON.stringify("Incorrect Login"));
      }
    }
  );
});

//fetches notes for given _id of user
app.get("/notes/:userId", (req, res) => {
  const userId = req.params.userId;
  User.findOne(
    {
      _id: userId,
    },
    function (err, foundUser) {
      if (foundUser) {
        res.send(foundUser.notes);
      } else {
        res.send(`User does not exist for id ${userId}`);
      }
    }
  );
});

app.put("/notes/:userId", (req, res) => {
  const userId = req.params.userId;
  const newNote = new Note({
    title: req.body.title,
    content: req.body.content,
  });

  User.findOneAndUpdate(
    {
      _id: userId,
    },
    {
      $push: { notes: newNote },
    },
    function (err, success) {
      if (err) {
        res.send(`Could not add note for reason ${err}`);
      } else {
        res.send(`Was able to add note: ${newNote}`);
      }
    }
  );
});

app.get("/api", (req, res) => {
  res.json({ message: "Here is your json response" });
});

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
