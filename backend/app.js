"use strict";

const express = require("express");
const cors = require("cors");

const { NotFoundError } = require("./expressError");

const { authenticateJWT } = require("./middleware/auth");
const authRoutes = require("./routes/auth");
const usersRoutes = require("./routes/users");
const monsterRoutes = require("./routes/monsters");
const locationRoutes = require("./routes/locations");
const armorSetRoutes = require("./routes/armorsets");
const armorRoutes = require("./routes/armor");
const weaponRoutes = require("./routes/weapons");
const charmRoutes = require("./routes/charms");
const decorationRoutes = require("./routes/decorations");
const skillRoutes = require("./routes/skills");
const elementRoutes = require("./routes/elements");
const getData = require("./helpers/getData");

const morgan = require("morgan");

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan("tiny"));
app.use(authenticateJWT);

app.use("/auth", authRoutes);
app.use("/users", usersRoutes);
app.use("/monsters", monsterRoutes);
app.use("/locations", locationRoutes);
app.use("/armorsets", armorSetRoutes);
app.use("/armor", armorRoutes);
app.use("/weapons", weaponRoutes);
app.use("/charms", charmRoutes);
app.use("/decorations", decorationRoutes);
app.use("/skills", skillRoutes);
app.use("/elements", elementRoutes);
getData();

app.use(function (req, res, next) {
  return next(new NotFoundError());
});

app.use(function (err, req, res, next) {
  if (process.env.NODE_ENV !== "test") console.error(err.stack);
  const status = err.status || 500;
  const message = err.message;

  return res.status(status).json({
    error: { message, status },
  });
});

module.exports = app;
