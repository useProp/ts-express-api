import { Schema, model, Document } from "mongoose";
import { User } from './user.interface';

const addressSchema = new Schema({
  country: String,
  city: String,
  street: String,
});

const userSchema = new Schema({
  name: String,
  email: String,
  password: String,
  address: addressSchema,
});

export const UserModel = model<User & Document>("User", userSchema);