"use strict";

const express = require("express");
const ArmorSet = require("../models/armorset");

const router = new express.Router();

router.get("/", async (req, res, next) => {
  try {
    const armorSets = await ArmorSet.findAll();
    return res.json(armorSets);
  } catch (err) {
    return next(err);
  }
});

router.get("/:id", async (req, res, next) => {
  const id = req.params.id;
  try {
    const result = await Promise.all([
      ArmorSet.findArmorSet(id),
      ArmorSet.findSkills(id),
      ArmorSet.findArmor(id)
    ]);
    const armorSet = result[0];
    armorSet.skills = result[1];
    armorSet.armor = result[2];
    return res.json(armorSet)
  } catch (err) {
    return next(err)
  }
});

module.exports = router;