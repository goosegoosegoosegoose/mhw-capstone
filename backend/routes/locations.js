"use strict";

const express = require("express");
const Location = require("../models/location");

const router = new express.Router();

router.get("/", async (req, res, next) => {
  const q = req.query;
  try {
    const monsters = await Location.findAll(q);
    return res.json(monsters);
  } catch (err) {
    return next(err);
  }
});

router.get("/:id", async (req, res, next) => {
  const id = req.params.id;
  try {
    const result = await Promise.all([
      Location.findLocation(id),
      Location.findMonsters(id)
    ]);
    const location = result[0];
    location.monsters = result[1];
    return res.json(location)
  } catch (err) {
    return next(err)
  }
});

module.exports = router;