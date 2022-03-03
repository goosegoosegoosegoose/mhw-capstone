"use strict";

const jsonschema = require("jsonschema");
const express = require("express");
const Element = require("../models/element");
const { ensureLoggedIn } = require("../middleware/auth");

const router = new express.Router();

router.get("/", ensureLoggedIn, async (req, res, next) => {
  const q = req.query
  try {
    const elements = await Element.findAll(q);
    return res.json(elements);
  } catch (err) {
    return next(err);
  }
});

router.get("/:ele", ensureLoggedIn, async (req, res, next) => {
  const ele = req.params.ele;
  try {
    const result = await Promise.all([
      Element.findElement(ele),
      Element.findWeapons(ele),
      Element.findMonsters(ele)
    ]);
    const element = result[0];
    element.weapons = result[1];
    element.monsters = result[2];
    return res.json(element)
  } catch (err) {
    return next(err)
  }
});

module.exports = router;