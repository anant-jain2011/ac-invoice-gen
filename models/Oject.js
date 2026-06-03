const mongoose = require("mongoose");

const ojSchema = new mongoose.Schema({
  text: String,
  type: String,
  tType: String,
});

module.exports = mongoose.models.Oject || mongoose.model("Oject", ojSchema);