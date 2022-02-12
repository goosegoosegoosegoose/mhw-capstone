"use strict";

const jsonschema = require("jsonschema");
const express = require("express");
const Element = require("../models/element")

const router = new express.Router();

router.get("/", async (req, res, next) => {
  try {
    const elements = await Element.findAll();
    return res.json(elements);
  } catch (err) {
    return next(err);
  }
});

router.get("/:ele", async (req, res, next) => {
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