import { Schema, model, Document } from 'mongoose';
import User from './user.interface';

const addressSchema = new Schema({
  country: String,
  city: String,
  street: String,
});

const userSchema = new Schema({
  name: String,
  email: String,
  password: String,
  twoFactorAuthenticationCode: String,
  isTwoFactorAuthenticationEnabled: Boolean,
  address: addressSchema,
});

const userModel = model<User & Document>('User', userSchema);

export default userModel;