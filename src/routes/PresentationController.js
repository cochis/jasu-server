const { Router } = require("express");
const router = Router();

const Presentation = require("../models/Presentation");

router.get("/presentations", async (req, res) => {
  const presentations = await Presentation.find({});
  return res.status(200).json(presentations);
});

router.get("/presentation/:id", async (req, res) => {
    const presentation = await Presentation.findById(req.params.id);
    return res.status(200).json(presentation);
});

module.exports = router;
