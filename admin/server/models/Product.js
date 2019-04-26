import { Schema, model } from "mongoose";

const Product = new Schema({
  name: String,
  quantity: Number,
  price: Number,
  expirationDate: Date,
  createdAt: Date,
  updatedAt: Date
});

export default model("product", Product);
