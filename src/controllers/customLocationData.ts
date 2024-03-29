import { Request, Response, NextFunction } from 'express';
import { CustomLocationData, IData } from '../models/data';

const addData = async (req: Request, res: Response, next: NextFunction) => {
  try{
    req.body.date = new Date(req.body.date.slice(0, 10));
    const data = new CustomLocationData(req.body);
    const result = await data.save();
    return res.status(201).json(result);
  }
  catch(err){
    return res.status(409).json({ message: "Date already exists" });
  }
};

const addDataset = async (req: Request, res: Response, next: NextFunction) => {
  try{
    const data = req.body as IData[];
    data.forEach(e => e.date = new Date(e.date));
    const bulkOp = CustomLocationData.collection.initializeUnorderedBulkOp();
    data.forEach(e => {
      bulkOp.find({ location_code: e.location_code, date: e.date }).upsert().replaceOne(e);
    });
    await bulkOp.execute();
    return res.status(201).json(data);
  }
  catch(err){
    return res.status(500).json(err);
  }
};

const updateData = async (req: Request, res: Response, next: NextFunction) => {
  try{
    const data = await CustomLocationData.findOneAndUpdate({ location_code: req.query.location_code, date: req.query.old_date },
      req.body,
      { new: true, upsert: true }
    );
    return res.status(200).json(data);
  }
  catch(err){
    return res.status(409).json({ message: "Date already exists" });
  }
};

const deleteDataSelection = async (req: Request, res: Response, next: NextFunction) => {
  try{
    const data = await CustomLocationData.deleteMany({ location_code: req.body.location_code, date: { $in: req.body.dates } });
    return res.status(200).json(data);
  }
  catch(err){
    return res.status(500).json(err);
  }
};

export default { addData, addDataset, updateData, deleteDataSelection };
