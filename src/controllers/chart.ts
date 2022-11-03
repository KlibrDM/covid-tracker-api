import { Request, Response, NextFunction } from 'express';
import Chart, { IChart } from '../models/chart';
import { accessAllowed } from '../utils/checkRole';

const getAllCharts = async (req: Request, res: Response, next: NextFunction) => {
  try{
    if(!(await accessAllowed(req.headers["authData"], 'admin'))){
      return res.status(403).json({ message: "Forbidden" });
    }

    const result = await Chart.find();
    return res.status(200).json(result);
  }
  catch(err){
    return res.status(500).json(err);
  }
};

const getPublicCharts = async (req: Request, res: Response, next: NextFunction) => {
  try{
    const result = await Chart.find({ is_public: true });
    return res.status(200).json(result);
  }
  catch(err){
    return res.status(500).json(err);
  }
};

const getCharts = async (req: Request, res: Response, next: NextFunction) => {
  try{
    if(req.headers["authData"] && (req.headers["authData"] as any).id){
      const result = await Chart.find({ ownerId: (req.headers["authData"] as any).id });
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

const getChart = async (req: Request, res: Response, next: NextFunction) => {
  try{
    const result = await Chart.findById(req.params.id);
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

const addChart = async (req: Request, res: Response, next: NextFunction) => {
  try{
    const chart = new Chart(req.body as IChart);
    const result = await Chart.create(chart);
    return res.status(200).json(result);
  }
  catch(err){
    return res.status(500).json(err);
  }
};

export default { getAllCharts, getPublicCharts, getCharts, getChart, addChart };
