"use strict";

const jsonschema = require("jsonschema");
const express = require("express");
const Decoration = require("../models/decoration");
const { ensureLoggedIn, ensureCorrectUserOrAdmin } = require("../middleware/auth");

const router = new express.Router();

router.get("/", ensureLoggedIn, async (req, res, next) => {
  try {
    const decorations = await Decoration.findAll();
    return res.json(decorations)
  } catch (err) {
    next(err)
  }
})

router.get("/:id", ensureLoggedIn, async (req, res, next) => {
  const id = req.params.id;
  try {
    const result = await Promise.all([
      Decoration.findDecoration(id),
      Decoration.findSkills(id)
    ]);
    const decoration = result[0];
    decoration.skills = result[1];
    return res.json(decoration)
  } catch (err) {
    next(err)
  }
});

router.post("/:id/user/:username", ensureCorrectUserOrAdmin, async (req, res, next) => {
  const id = req.params.id;
  const username = req.params.username;
  try {
    await Decoration.userAdd(username, id);
    return res.status(201).json({ id })
  } catch (err) {
    return next(err);
  }
});

router.delete("/:id/user/:username", ensureCorrectUserOrAdmin, async (req, res, next) => {
  const id = req.params.id;
  const username = req.params.username
  try {
    await Decoration.userRemove(username, id);
    return res.status(200).json({ id })
  } catch (err) {
    return next(err);
  }
});

module.exports = router;