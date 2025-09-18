import { Document, model, Schema } from "mongoose";

interface IUser extends Document {
  email: string;
  password?: string;
  passKey?: string;
}

const UserSchema = new Schema<IUser>(
  {
    email: { type: String, required: true, trim: true },
    passKey: { type: String, trim: true },
    password: { type: String, required: true },
  },
  { timestamps: true }
);

export const User = model<IUser>("User", UserSchema);
