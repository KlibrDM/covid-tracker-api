import { Request, Response, NextFunction } from 'express';
import Report, { IReport } from '../models/report';
import { accessAllowed } from '../utils/checkRole';

const getAllReports = async (req: Request, res: Response, next: NextFunction) => {
  try{
    if(!(await accessAllowed(req.headers["authData"], 'admin'))){
      return res.status(403).json({ message: "Forbidden" });
    }

    const result = await Report.find();
    return res.status(200).json(result);
  }
  catch(err){
    return res.status(500).json(err);
  }
};

const getPublicReports = async (req: Request, res: Response, next: NextFunction) => {
  try{
    const limit = parseInt(req.query.limit as string) || 0;
    const result = await Report.find(
      { is_public: true },
      null,
      {
        limit: limit,
        sort: { createdAt: -1 }
      }
    );
    return res.status(200).json(result);
  }
  catch(err){
    return res.status(500).json(err);
  }
};

const getReports = async (req: Request, res: Response, next: NextFunction) => {
  try{
    if(req.headers["authData"] && (req.headers["authData"] as any).id){
      const limit = parseInt(req.query.limit as string) || 0;
      const result = await Report.find(
        { ownerId: (req.headers["authData"] as any).id },
        null,
        {
          limit: limit,
          sort: { createdAt: -1 }
        }
      );
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

const getReport = async (req: Request, res: Response, next: NextFunction) => {
  try{
    const result = await Report.findById(req.params.id);
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

const deleteReport = async (req: Request, res: Response, next: NextFunction) => {
  try{
    if(req.headers["authData"] && (req.headers["authData"] as any).id){
      const result = await Report.findById(req.params.id);
      if(result && result.ownerId === (req.headers["authData"] as any).id){
        await Report.deleteOne({ _id: req.params.id });
        return res.status(200).json({ message: "Report deleted" });
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


const updateReport = async (req: Request, res: Response, next: NextFunction) => {
  try{
    if(req.headers["authData"] && (req.headers["authData"] as any).id){
      const result = await Report.findById(req.params.id);
      if(result && result.ownerId === (req.headers["authData"] as any).id){
        const response = await Report.updateOne({ _id: req.params.id }, req.body);
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

const addReport = async (req: Request, res: Response, next: NextFunction) => {
  try{
    if(req.headers["authData"] && (req.headers["authData"] as any).id){
      const report = new Report(req.body as IReport);
      const result = await Report.create(report);
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

export default { getAllReports, getPublicReports, getReports, getReport, deleteReport, updateReport, addReport };
