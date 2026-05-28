import mongoose from 'mongoose';

export default async function cook() {
  await mongoose
    .connect(process.env.MONGODB_URI + "ACInvoice")
    .then(() => console.log("MongoDB Connected"))
    .catch((err) => console.log(err));
}