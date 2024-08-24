import mongoose, { Schema } from 'mongoose';

type User = {
  name: string;
  pin: string;
  phone: string;
  email: string;
  role: string;
  statusOfUser: string;
  balance: number;
}

const UserSchema = new Schema<User>({
  name: { type: String, required: true },
  pin: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String, required: true },
  role: { type: String, required: true },
  statusOfUser: { type: String, default: 'pending' },
  balance: { type: Number, default: 0 },
});

const User = mongoose.model<User>('User', UserSchema);
export default User;
