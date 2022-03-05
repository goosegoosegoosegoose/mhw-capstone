"use strict";

const jsonschema = require("jsonschema");
const express = require("express");
const Weapon = require("../models/weapon");
const { ensureLoggedIn, ensureCorrectUserOrAdmin } = require("../middleware/auth");

const router = new express.Router();

router.get("/", ensureLoggedIn, async (req, res, next) => {
  const q = req.query;
  try {
    const types = await Weapon.findTypes(q);
    return res.json(types)
  } catch (err) {
    return next(err)
  }
});

router.get("/:type", ensureLoggedIn, async (req, res, next) => {
  const type = req.params.type;
  const q = req.query;
  try {
    const weapons = await Weapon.findOneType(type, q)
    return res.json(weapons);
  } catch(err) {
    return next(err)
  }
});

router.get("/w/:id", ensureLoggedIn, async (req, res, next) => {
  const id = req.params.id;
  try {
    const result = await Promise.all([
      Weapon.findWeapon(id),
      Weapon.findElements(id),
      Weapon.findMaterials(id)
    ]);
    const weapon = result[0];
    weapon.elements = result[1];
    weapon.materials = result[2];
    res.json(weapon)
  } catch (err){
    return next(err)
  }
});

router.post("/:id/user/:username", ensureCorrectUserOrAdmin, async (req, res, next) => {
  const id = req.params.id;
  const username = req.params.username;
  try {
    await Weapon.userAdd(username, id);
    return res.status(201).json({ id })
  } catch (err) {
    return next(err);
  }
});

router.delete("/:id/user/:username", ensureCorrectUserOrAdmin, async (req, res, next) => {
  const id = req.params.id;
  const username = req.params.username
  try {
    await Weapon.userRemove(username, id);
    return res.status(200).json({ id })
  } catch (err) {
    return next(err);
  }
});

module.exports = router;