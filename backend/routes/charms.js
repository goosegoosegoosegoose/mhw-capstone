"use strict";

const jsonschema = require("jsonschema");
const express = require("express");
const Charm = require("../models/charm");
const { ensureLoggedIn, ensureCorrectUserOrAdmin } = require("../middleware/auth");

const router = new express.Router();

router.get("/", ensureLoggedIn, async (req, res, next) => {
  try {
    const charms = await Charm.findAll();
    return res.json(charms)
  } catch (err) {
    return next(err);
  }
});

router.get("/:id", ensureLoggedIn, async (req, res, next) => {
  const id = req.params.id;
  try {
    const result = await Promise.all([
      Charm.findCharm(id),
      Charm.findSkills(id),
      Charm.findMaterials(id)
    ])
    const charm = result[0];
    charm.skills = result[1];
    charm.materials = result[2];
    return res.json(charm)
  } catch (err) {
    return next(err)
  }
});

router.post("/:id/user/:username", ensureCorrectUserOrAdmin, async (req, res, next) => {
  const id = req.params.id;
  const username = req.params.username;
  try {
    await Charm.userAdd(username, id);
    return res.status(201).json({ id })
  } catch (err) {
    return next(err);
  }
});

router.delete("/:id/user/:username", ensureCorrectUserOrAdmin, async (req, res, next) => {
  const id = req.params.id;
  const username = req.params.username
  try {
    await Charm.userRemove(username, id);
    return res.status(200).json({ id })
  } catch (err) {
    return next(err);
  }
});

module.exports = router;