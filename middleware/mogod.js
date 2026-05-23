import mongoose from 'mongoose';

export default async function cook() {
    await mongoose
  .connect("mongodb+srv://kumkumnidhi14_db_user:QVcpRvEDLUIaxjsl@cluster0.xkgcby8.mongodb.net/AC-VOICE")
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));
}