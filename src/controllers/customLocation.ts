import { Request, Response, NextFunction } from 'express';
import CustomLocation, { ICustomLocation } from '../models/customLocation';
import { CustomLocationData } from '../models/data';
import { accessAllowed } from '../utils/checkRole';

const getAllCustomLocations = async (req: Request, res: Response, next: NextFunction) => {
  try{
    if(!(await accessAllowed(req.headers["authData"], 'admin'))){
      return res.status(403).json({ message: "Forbidden" });
    }
    
    const result = await CustomLocation.find();
    return res.status(200).json(result);
  }
  catch(err){
    return res.status(500).json(err);
  }
};

const getPublicCustomLocations = async (req: Request, res: Response, next: NextFunction) => {
  try{   
    const result = await CustomLocation.find({ is_public: true });
    return res.status(200).json(result);
  }
  catch(err){
    return res.status(500).json(err);
  }
};

const getCustomLocations = async (req: Request, res: Response, next: NextFunction) => {
  try{
    if(req.headers["authData"] && (req.headers["authData"] as any).id){
      const result = await CustomLocation.find({ ownerId: (req.headers["authData"] as any).id });
      return res.status(200).json(result);
    }
    else{
      return res.status(403).json({ message: "Forbidden" });
    }
  }
  catch(err){
    return res.status(500).json(err);
  }
};

const getCustomLocation = async (req: Request, res: Response, next: NextFunction) => {
  try{
    const result = await CustomLocation.findOne({ code: req.params.code });
    if(result && (result.ownerId === (req.headers["authData"] as any).id || result.is_public)){
      return res.status(200).json(result);
    }
    else{
      return res.status(403).json({ message: "Forbidden" });
    }
  }
  catch(err){
    return res.status(500).json(err);
  }
};

const deleteCustomLocation = async (req: Request, res: Response, next: NextFunction) => {
  try{
    if(req.headers["authData"] && (req.headers["authData"] as any).id){
      const result = await CustomLocation.findOne({ code: req.params.code });
      if(result && result.ownerId === (req.headers["authData"] as any).id){
        //Delete location
        await CustomLocation.deleteOne({ code: req.params.code });
        //Delete all associated data
        await CustomLocationData.deleteMany({ location_code: req.params.code });
        return res.status(200).json({ message: "Location deleted" });
      }
      else{
        return res.status(403).json({ message: "Forbidden" });
      }
    }
    else{
      return res.status(403).json({ message: "Forbidden" });
    }
  }
  catch(err){
    return res.status(500).json(err);
  }
};

const updateCustomLocation = async (req: Request, res: Response, next: NextFunction) => {
  try{
    if(req.headers["authData"] && (req.headers["authData"] as any).id){
      const result = await CustomLocation.findOne({ code: req.params.code });
      if(result && result.ownerId === (req.headers["authData"] as any).id){
        const response = await CustomLocation.updateOne({ code: req.params.code }, req.body);
        return res.status(200).json(response);
      }
      else{
        return res.status(403).json({ message: "Forbidden" });
      }
    }
    else{
      return res.status(403).json({ message: "Forbidden" });
    }
  }
  catch(err){
    return res.status(500).json(err);
  }
};

const addCustomLocation = async (req: Request, res: Response, next: NextFunction) => {
  try{
    const location = new CustomLocation(req.body as ICustomLocation);
    location.code = location.code.toUpperCase();
    
    if(await CustomLocation.findOne({ code: location.code })){
      return res.status(409).json({ message: "Location code already exists" });
    }

    const result = await CustomLocation.create(location);
    return res.status(200).json(result);
  }
  catch(err){
    return res.status(500).json(err);
  }
};

export default { getAllCustomLocations, getPublicCustomLocations, getCustomLocations, getCustomLocation, deleteCustomLocation, updateCustomLocation, addCustomLocation };
