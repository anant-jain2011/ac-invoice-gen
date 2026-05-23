import cook from "middleware/mogod";
import mongoose from "mongoose";

export default async function handler(req, res) {
  await cook();
  const newItem = new StringModel({ text: req.body.text });
  await newItem.save();
  res.status(200).json({ newItem });
}
