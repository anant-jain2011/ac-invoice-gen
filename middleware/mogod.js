import mongoose from 'mongoose';

// console.log(process.env.MONGODB_URI)

export default function cook() {
  (async () => {
  await mongoose
    .connect("mongodb+srv://kumkumnidhi14_db_user:QVcpRvEDLUIaxjsl@cluster0.xkgcby8.mongodb.net/ACInvoice")
    .then(() => console.log("MongoDB Connected"))
    .catch((err) => console.log(err));
  })()
}
