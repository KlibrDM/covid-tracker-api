import { Request, Response, NextFunction } from 'express';
import axios, { AxiosResponse } from 'axios';
import Location, { ILocation } from '../models/location';
import csv from 'csvtojson';
import { accessAllowed } from '../utils/checkRole';

const getLocations = async (req: Request, res: Response, next: NextFunction) => {
  try{
    const result = await Location.find();
    return res.status(200).json(result);
  }
  catch(err){
    return res.status(500).json(err);
  }
};

const getLocation = async (req: Request, res: Response, next: NextFunction) => {
  try{
    const code = req.params.code;
    const result = await Location.find({ code });
    return res.status(200).json(result);
  }
  catch(err){
    return res.status(500).json(err);
  }
};

const addLocation = async (req: Request, res: Response, next: NextFunction) => {
  try{
    if(!(await accessAllowed(req.headers["authData"], ['admin','pro']))){
      return res.status(403).json({ message: "Forbidden" });
    }

    const location = new Location(req.body as ILocation);
    const result = await Location.create(location);
    return res.status(200).json(result);
  }
  catch(err){
    return res.status(500).json(err);
  }
};

const loadLatestLocations = async (req: Request, res: Response, next: NextFunction) => {
  try{
    if(!(await accessAllowed(req.headers["authData"], 'admin'))){
      return res.status(403).json({ message: "Forbidden" });
    }
    const response = await loadLatestLocationsManager();
    return res.status(200).json(response);
  }
  catch(err){
    return res.status(500).json(err);
  }
};

export const loadLatestLocationsManager = async () => {
  const result: AxiosResponse = await axios.get(`https://covid.ourworldindata.org/data/latest/owid-covid-latest.csv`);
  const csvStr = result.data;
  let jsonObj = await csv().fromString(csvStr);

  //Remodel data
  jsonObj = jsonObj.map(e => ({
    code: e.iso_code,
    continent: e.continent || undefined,
    name: e.location,
    type: e.continent ? 'country' : 'owidcat',
    population: e.population || undefined,
    population_density: e.population_density || undefined,
    median_age: e.median_age || undefined,
    aged_65_older: e.aged_65_older || undefined,
    hospital_beds_per_thousand: e.hospital_beds_per_thousand || undefined,
    gdp_per_capita: e.gdp_per_capita || undefined,
    life_expectancy: e.life_expectancy || undefined
  }));

  //Save to DB
  jsonObj.forEach(async e => {
    const updatedLocation = await Location.updateOne({ code: e.code }, e, { upsert: true });
    if(!updatedLocation){
      await Location.create(e);
    }
  });

  return jsonObj;
}

export default { getLocations, getLocation, addLocation, loadLatestLocations };
