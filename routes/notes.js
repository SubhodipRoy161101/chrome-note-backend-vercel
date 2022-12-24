const express = require("express");
const router = express.Router();
const Notes = require("../models/Notes");
const fetchUser = require("../middleware/fetchUser");
const { body, validationResult } = require("express-validator");

//GET notes from databse of logged in user. Login required.
router.get("/fetchallnotes", fetchUser, async (req, res) => {
  try {
    const notes = await Notes.find({ user: req.user.id });
    res.json(notes);
  } catch (error) {
    res.status(500).send("Some error occoured");
  }
});

//Add a notes using POST. Login required.
router.post(
  "/addnote",
  fetchUser,
  [
    body("description").isLength({ min: 5 }),
    body("title").isLength({ min: 3 }),
    body("tag").isLength({ min: 2 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      const { title, description, tag } = req.body;
      const note = new Notes({
        title,
        description,
        tag,
        user: req.user.id,
      });
      note.save();
      res.json(note);
    } catch (error) {
      res.status(500).send("Some error occoured");
    }
  }
);

//Update notes using PUT. Login Required.
router.put("/updatenote/:id", fetchUser, async (req, res) => {
  const { title, description, tag } = req.body;
  newNote = {};
  if (title) {
    newNote.title = title;
  }
  if (description) {
    newNote.description = description;
  }
  if (tag) {
    newNote.tag = tag;
  }

  const findNote = await Notes.findById(req.params.id);
  const noteId = findNote.id;
  noteId.toString();
  console.log(noteId);
  console.log({ noteId });
  if (!findNote) {
    return res.status(404).send("Not Found !!!");
  }

  if (noteId != req.params.id) {
    return res.status(401).send("Access Denied");
  }

  const updateNote = await Notes.findByIdAndUpdate(
    req.params.id,
    { $set: newNote },
    { new: true }
  );
  res.json(updateNote);
});

//Delete notes using DELETE. Login Required.
router.delete("/deletenote/:id", fetchUser, async (req, res) => {
  try {
    const findNote = await Notes.findById(req.params.id);
    const noteId = findNote.id;
    noteId.toString();
    if (!findNote) {
      return res.status(404).send("Not Found !!!");
    }

    if (noteId != req.params.id) {
      return res.status(401).send("Access Denied");
    }

    const deleteNote = await Notes.findByIdAndDelete(req.params.id);
    res.json("Note" + deleteNote + "deleted");
  } catch (error) {
    res.status(500).send("Note Not Found");
  }
});

module.exports = router;
