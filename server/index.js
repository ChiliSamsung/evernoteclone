const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const path = require("path");

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

//have Node serve the files for our built React app
app.use(express.static(path.resolve(__dirname, "../client/build")));

//mongo DB atlas database is here as opposed to localhost.
mongoose.connect("mongodb://127.0.0.1:27017/notesDB");
// mongoose.connect(
//   "mongodb+srv://test-admin:clobberSlobberProper45@cluster0.lnz11yi.mongodb.net/?retryWrites=true&w=majority"
// );

const NoteSchema = new mongoose.Schema({
  title: String,
  content: String,
});

const NotebookSchema = new mongoose.Schema({
  name: {
    required: true,
    type: String,
  },
  notes: [NoteSchema],
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
  notebooks: [NotebookSchema],
});

const User = mongoose.model("User", UserSchema);
const Note = mongoose.model("Note", NoteSchema);
const Notebook = mongoose.model("Notebook", NotebookSchema);

/** Routes */
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

app
  .route("/notes/:userId")
  //fetches notes for given _id of user
  .get((req, res) => {
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
  })
  //add new note for a given user ID.
  .put((req, res) => {
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

app
  .route("/notes/:userId/:noteId")
  //get a note for a given user
  .get((req, res) => {
    const userId = req.params.userId;
    const noteId = req.params.noteId;
    User.findById(userId, function (err, foundUser) {
      if (foundUser) {
        const foundNote = foundUser.notes.find((note) => note._id == noteId);
        if (foundNote) {
          res.status(200);
          res.send(foundNote);
          return;
        }
      }
      res.status(404);
      return res.send("Note note found");
    });
  })
  //edit an existing note for given user
  .patch((req, res) => {
    const userId = req.params.userId;
    const noteId = req.params.noteId;
    const newTitle = req.body.title;
    const newContent = req.body.content;
    const newNote = {
      title: newTitle,
      content: newContent,
    };
    User.findOneAndUpdate(
      {
        _id: userId,
        "notes._id": noteId,
      },
      {
        $set: { "notes.$.title": newTitle, "notes.$.content": newContent },
      },
      function (err, success) {
        if (err) {
          res.send(`Could not edit note for reason ${err}`);
        } else {
          res.send(`Was able to edit to new note: ${newNote}`);
        }
      }
    );
  })
  //delete a given note for a given user
  .delete((req, res) => {
    const userId = req.params.userId;
    const noteId = req.params.noteId;
    User.findOneAndUpdate(
      {
        _id: userId,
      },
      {
        $pull: { notes: { _id: noteId } },
      },
      function (err, success) {
        if (err) {
          console.log(err);
          res.send(`Could not delete not for reason ${err}`);
        } else {
          res.send(`Was able to delete note for user ${userId}`);
        }
      }
    );
  });

/*** notebook stuff **/
//add new notebook
app.post("/:userId/newnotebook", (req, res) => {
  const newNotebook = new Notebook({
    name: req.body.notebookName,
  });
  User.findOneAndUpdate(
    {
      _id: req.params.userId,
    },
    {
      $push: { notebooks: newNotebook },
    },
    function (err, success) {
      res.status(success ? 200 : 404);
      res.send(`Error: ${err} Success: ${success}`);
    }
  );
});

//get all the notebooks for a given user
app.get("/notebooks/:userId", (req, res) => {
  User.findOne({ _id: req.params.userId }, (err, foundUser) => {
    if (foundUser) {
      res.status(200);
      res.send(foundUser.notebooks);
      return;
    }
    res.status(404);
    res.send("No notebooks found");
  });
});

app
  .route("/:userId/:notebookId")
  //return notebok for a given notebook ID.
  .get((req, res) => {
    User.findOne({ _id: req.params.userId }, (err, foundUser) => {
      if (foundUser) {
        const notebook = foundUser.notebooks.find(
          (note) => note._id == req.params.notebookId
        );
        if (notebook) {
          res.send(notebook);
          return;
        }
      }
      res.send(`Error ${err}`);
    });
  })

  //add existing note to notebook
  .patch((req, res) => {
    const userId = req.params.userId;
    const noteId = req.body.noteId;
    User.findById(userId, function (err, foundUser) {
      if (foundUser) {
        const foundNote = foundUser.notes.find((note) => note._id == noteId);
        if (foundNote) {
          //remove note from any existing notebooks
          User.findOneAndUpdate(
            {
              _id: userId,
              "notebooks.notes": { $elemMatch: { foundNote } },
            },
            {
              $pull: { "notebooks.$.notes": foundNote },
            },
            function (err, success) {}
          );

          //add note to the new notebook
          User.findOneAndUpdate(
            {
              _id: userId,
              "notebooks._id": req.params.notebookId,
            },
            {
              $addToSet: { "notebooks.$.notes": foundNote },
            },
            function (err, success) {
              res.send(`Error: ${err} Success: ${success}`);
            }
          );
          return;
        }
      }
      res.status(404);
      return res.send("Note not found");
    });
  })
  //delete existing notebook
  .delete((req, res) => {
    User.findOneAndUpdate(
      {
        _id: req.params.userId,
      },
      {
        $pull: { notebooks: { _id: req.params.notebookId } },
      },
      function (err, success) {
        res.send(`Error: ${err} Succcess: ${success}`);
      }
    );
  });

//All other GET requests not handled will return our React app
app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "../client/build", "index.html"));
});

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
