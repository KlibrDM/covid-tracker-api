import { Request, Response, NextFunction } from 'express';
import User from '../models/user';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

require("dotenv").config();

const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password, role, location_code } = req.body;
    if(!email || !password || !location_code){
      return res.status(400).json({ message: "Missing required fields" });
    }

    if(!email.includes("@") || !email.includes(".") || email.length < 5 || email.length > 100){
      return res.status(400).json({ message: "Invalid email" });
    }

    if(password.length < 8){
      return res.status(400).json({ message: "Password must be at least 8 characters long" });
    }

    const userExists = await User.findOne({ email });
    if(userExists){
      return res.status(409).json({ message: "User already exists" });
    }

    const user = await User.create({
      email,
      password: await bcrypt.hash(password, 10),
      role: role ? role : 'user',
      location_code: location_code
    });
    const token = jwt.sign({ id: user._id }, process.env.TOKEN_KEY!, { expiresIn: 86400 * 31 });

    user.token = token;
    await user.save();

    return res.status(200).json(user);
  }
  catch(err){
    return res.status(500).json(err);
  }
};

const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if(!user){
      return res.status(401).json({ message: "Invalid email" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if(!isPasswordValid){
      return res.status(401).json({ message: "Invalid password" });
    }

    const token = jwt.sign({ id: user._id }, process.env.TOKEN_KEY!, { expiresIn: 86400 * 31 });
    
    user.token = token;
    await user.save();

    return res.status(200).json(user);
  }
  catch(err){
    return res.status(500).json(err);
  }
};

export default { register, login };
