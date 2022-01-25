"use strict";

const jsonschema = require("jsonschema");
const express = require("express");
const axios = require("axios");
const Armor = require("../models/armor");
const BASE_URL = "https://mhw-db.com"

const router = new express.Router();

router.get("/", async (req, res, next) => {
  try {
    if (!req.query.q) {
      const apiRes = await axios.get(`${BASE_URL}/armor`);
      return res.json( apiRes.data );
    };
    const apiRes = await axios.get(`${BASE_URL}/armor?q={"name":{"$like":"%${req.query.q}%"}}`);
    return res.json( apiRes.data );
  } catch (err) {
    return next(err);
  }
});

router.get("/:id", async (req, res, next) => {
  const id = req.params.id;
  try {
    const apiRes = await axios.get(`${BASE_URL}/armor/${id}`);
    return res.json(apiRes.data);
  } catch (err) {
    return next(err);
  }
});

router.post("/:id/user/:username", async (req, res, next) => {
  const id = req.params.id;
  const username = req.params.username;
  try {
    await Armor.add(username, id);
    return res.status(201).json({ added: `armor ${id} for user ${username}`})
  } catch (err) {
    return next(err);
  }
});

router.delete("/:id", async (req, res, next) => {
  const id = req.params.id;
  try {
    await Armor.remove(id);
    return res.status(200).json({ deleted: `armor ${id}`})
  } catch (err) {
    return next(err);
  }
});

router.delete("/:id/user/:username", async (req, res, next) => {
  const id = req.params.id;
  const username = req.params.username
  try {
    await Armor.remove(username, id);
    return res.status(200).json({ deleted: `armor ${id} from user ${username}`})
  } catch (err) {
    return next(err);
  }
});

module.exports = router;