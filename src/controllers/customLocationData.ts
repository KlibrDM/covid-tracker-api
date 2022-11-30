import { Request, Response, NextFunction } from 'express';
import { CustomLocationData } from '../models/data';

const addData = async (req: Request, res: Response, next: NextFunction) => {
  try{
    const data = new CustomLocationData(req.body);
    const result = await data.save();
    return res.status(201).json(result);
  }
  catch(err){
    return res.status(500).json(err);
  }
};

export default { addData };
