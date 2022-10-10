import mongoose from "mongoose";

const RoleTypes = [
  "admin",
  "pro",
  "user"
];
export type RoleType = typeof RoleTypes[number];

export interface IUser{
  first_name?: string;
  last_name?: string;
  email: string;
  password: string;
  role: RoleType;
  location_code: string;
  token?: string;
}

const UserSchema = new mongoose.Schema({
  first_name: {
    type: String,
    required: false,
  },
  last_name: {
    type: String,
    required: false,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    required: true,
    enum: RoleTypes,
  },
  location_code: {
    type: String,
    required: true,
  },
  token: {
    type: String,
    required: false,
  },
});

const User = mongoose.model<IUser>("user", UserSchema);
export default User;
