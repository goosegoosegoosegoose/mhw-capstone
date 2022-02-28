"use strict";

const jsonschema = require("jsonschema");
const express = require("express");
const Monster = require("../models/monster");
const { ensureCorrectUserOrAdmin } = require("../middleware/auth");

const router = new express.Router();

router.get("/", async (req, res, next) => {
  const q = req.query;
  try {
    const monsters = await Monster.findAll(q);
    return res.json(monsters);
  } catch (err) {
    return next(err);
  }
});

router.get("/:id", async (req, res, next) => {
  const id = req.params.id;
  try {
    const result = await Promise.all([
      Monster.findMonster(id),
      Monster.findLocations(id),
      Monster.findWeaknesses(id),
      Monster.findAilments(id),
      Monster.findMaterials(id)
    ]);
    const monster = result[0];
    monster.locations = result[1];
    monster.weaknesses = result[2];
    monster.ailments = result[3];
    monster.materials = result[4];
    return res.json(monster)
  } catch (err) {
    return next(err)
  }
});

router.post("/:id/user/:username", async (req, res, next) => {
  const id = req.params.id;
  const username = req.params.username;
  try {
    await Monster.userAdd(username, id);
    return res.json({ id });
  } catch (err) {
    return next(err);
  }
});

router.delete("/:id", async (req, res, next) => {
  const id = req.params.id;
  try {
    await Monster.userRemove(id);
    return res.status(200).json({ deleted: `monster ${id}`})
  } catch (err) {
    return next(err);
  }
});

router.post("/:id/user/:username", ensureCorrectUserOrAdmin, async (req, res, next) => {
  const id = req.params.id;
  const username = req.params.username;
  try {
    await Monster.userAdd(username, id);
    return res.status(201).json({ id })
  } catch (err) {
    return next(err);
  }
});

router.delete("/:id/user/:username", ensureCorrectUserOrAdmin, async (req, res, next) => {
  const id = req.params.id;
  const username = req.params.username
  try {
    await Monster.userRemove(username, id);
    return res.status(200).json({ id })
  } catch (err) {
    return next(err);
  }
});

module.exports = router;
