const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const auth = require("../../middleware/auth");
const Category = require("../../models/categories")
const User = require("../../models/user");
const UserD = require("../../models/userD");

const { body, validationResult } = require("express-validator");

// final api to use -> /api/categories/

router.get("/", async (req, res) => {
  res.status(201).json({
    message: "Welcome to the Laper Categories API",
  });
});

// final api to use -> /api/categories/add

router.post("/add", auth, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  try {
    const category = new Category();
      (category.cat_id = req.body.name + Date.now()),
      (category.name = req.body.name),
      (category.imageUrl = req.body.imageUrl),
      (category.totalEnrollment = 0),
      (category.tags = req.body.tags),
      category.experts = {}

    console.log("new category created, pushing to database");

    const saveRes = await request.save();

    if (!saveRes) {
      console.log("Some error occured");
      res.status(500).json({
        message: "An error has occured here.",
      });
    } else {
      res.status(201).json({
        message: "Category successfully created.",
      });
    }
  } catch (e) {
    console.log();
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
});
