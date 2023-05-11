import { Schema, model, Document } from 'mongoose';
import User from './user.interface';

const addressSchema = new Schema({
  city: String,
  street: String,
});

const userSchema = new Schema({
  address: addressSchema,
  name: String,
  email: String,
  password: String,
});

const userModel = model<User & Document>('User', userSchema);

export default userModel;