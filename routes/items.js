const express = require("express");
const router = new express.Router();
const ExpressError = require("../expressError");
const items = require("../fakeDb");

router.get("/", (req, res, next) => {
  res.json({ items });
});

router.post("/", (req, res, next) => {
  try {
    if (!req.body.name || !req.body.price)
      throw new ExpressError("Must include name and price", 400);
    const newItem = { name: req.body.name, price: req.body.price };
    items.push(newItem);
    return res.status(201).json({
      added: { newItem },
    });
  } catch (e) {
    return next(e);
  }
});

router.get("/:name", (req, res, next) => {
  const foundItem = items.find((item) => item.name === req.params.name);
  if (foundItem === undefined) {
    throw new ExpressError("Item not found", 404);
  }
  res.json({ name: foundItem.name, price: foundItem.price });
});

router.patch("/:name", (req, res, next) => {
  const foundItem = items.find((item) => item.name === req.params.name);
  if (foundItem === undefined) {
    throw new ExpressError("Item not found", 404);
  }
  foundItem.name = req.body.name;
  foundItem.price = req.body.price;
  res.json({ updated: { name: foundItem.name, price: foundItem.price } });
});

router.delete("/:name", (req, res, next) => {
  const foundItem = items.findIndex((item) => item.name === req.params.name);
  if (foundItem === -1) {
    throw new ExpressError("Item not found", 404);
  }
  items.splice(foundItem, 1);
  res.json({ message: "Deleted" });
});

module.exports = router;
