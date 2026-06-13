const validModes = ["prescription", "lab", "vitals"];

const validateRequest = (req, res, next) => {
  const { mode, textInput, imageBase64 } = req.body;

  if (!mode || !validModes.includes(mode)) {
    return res.status(400).json({ error: "Invalid mode. Use prescription, lab, or vitals." });
  }

  if (!textInput && !imageBase64) {
    return res.status(400).json({ error: "Provide either textInput or imageBase64." });
  }

  next();
};

export default validateRequest;