"use strict";

const jsonschema = require("jsonschema");
const express = require("express");
const axios = require("axios");
const Monster = require("../models/monster");
const BASE_URL = "https://mhw-db.com"

const router = new express.Router();

router.get("/", async (req, res, next) => {
  try {
    if (!req.query.q) {
      const apiRes = await axios.get(`${BASE_URL}/monsters`);
      return res.json( apiRes.data );
    };
    const apiRes = await axios.get(`${BASE_URL}/monsters?q={"name":{"$like":"%${req.query.q}%"}}`);
    return res.json( apiRes.data );
  } catch (err) {
    return next(err);
  }
});

router.get("/:id", async (req, res, next) => {
  const id = req.params.id;
  try {
    const apiRes = await axios.get(`${BASE_URL}/monsters/${id}`);
    return res.json(apiRes.data);
  } catch (err) {
    return next(err);
  }
});

router.post("/:id", async (req, res, next) => {
  const a_id = req.params.id;
  const u_id = req.query.userId;
  try {
    await Monster.add(id);
    return res.json({ added: `monster ${id}`});
  } catch (err) {
    return next(err);
  }
});

router.delete("/:id", async (req, res, next) => {
  const id = req.params.id;
  try {
    await Monster.delete(id);
    return res.status(200).json({ deleted: `monster ${id}`})
  } catch (err) {
    return next(err);
  }
});

module.exports = router;
