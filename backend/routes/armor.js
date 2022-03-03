"use strict";

const express = require("express");
const Armor = require("../models/armor");
const { ensureLoggedIn, ensureCorrectUserOrAdmin } = require("../middleware/auth");

const router = new express.Router();

router.get("/", ensureLoggedIn, async (req, res, next) => {
  const q = req.query;
  try {
    const armor = await Armor.findAll(q);
    return res.json(armor);
  } catch (err) {
    return next(err);
  }
});

router.get("/:id", ensureLoggedIn, async (req, res, next) => {
  const id = req.params.id;
  try {
    const result = await Promise.all([
      Armor.findArmor(id),
      Armor.findArmorSet(id),
      Armor.findSkills(id),
      Armor.findMaterials(id)
    ]);
    const armor = result[0];
    armor.set = result[1];
    armor.skills = result[2];
    armor.materials = result[3];
    return res.json(armor)
  } catch (err) {
    return next(err)
  }
});

router.post("/:id/user/:username", ensureCorrectUserOrAdmin, async (req, res, next) => {
  const id = req.params.id;
  const username = req.params.username;
  try {
    await Armor.userAdd(username, id);
    return res.status(201).json({ id })
  } catch (err) {
    return next(err);
  }
});

router.delete("/:id/user/:username", ensureCorrectUserOrAdmin, async (req, res, next) => {
  const id = req.params.id;
  const username = req.params.username
  try {
    await Armor.userRemove(username, id);
    return res.status(200).json({ id })
  } catch (err) {
    return next(err);
  }
});

module.exports = router;