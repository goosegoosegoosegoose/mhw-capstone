"use strict";

const jsonschema = require("jsonschema");
const express = require("express");
const Skill = require("../models/skill");

const router = new express.Router();

router.get("/", async (req, res, next) => {
  try {
    const skills = await Skill.findAll();
    return res.json(skills)
  } catch (err) {
    return next(err)
  }
});

router.get("/:id", async (req, res, next) => {
  const id = req.params.id;
  try {
    const result = await Promise.all([
      Skill.findSkill(id),
      Skill.findArmorSets(id),
      Skill.findArmor(id),
      Skill.findCharms(id),
      Skill.findDecos(id)
    ]);
    const skill = result[0];
    skill.armorSets = result[1];
    skill.armor = result[2];
    skill.charms = result[3];
    skill.decorations = result[4];
    return res.json(skill)
  } catch (err) {
    return next(err)
  }
});

module.exports = router;