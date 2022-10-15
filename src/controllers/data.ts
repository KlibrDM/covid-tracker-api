import { Request, Response, NextFunction } from 'express';
import axios, { AxiosResponse } from 'axios';
import csv from 'csvtojson';
import moment from 'moment';
import { Data, IData, LatestData } from '../models/data';
import { accessAllowed } from '../utils/checkRole';

const getData = async (req: Request, res: Response, next: NextFunction) => {
  try{
    const queryParams = {
      location_code: req.query.location_code,
      date: req.query.start_date && req.query.end_date
            ? { $gte : req.query.start_date, $lte : req.query.end_date }
            : req.query.start_date 
            ? { $gte : req.query.start_date }
            : req.query.end_date
            ? { $lte : req.query.end_date }
            : { $exists: true }
    };

    let projection: string[] = [];
    let queryProjection: object | undefined = undefined;
    if(req.query.projection){
      if(typeof req.query.projection === 'string'){
        projection.push(req.query.projection);
      }
      else{
        projection = req.query.projection as string[];
      }

      queryProjection = projection.reduce((acc: any, cur: string) => {
        acc[cur] = 1;
        return acc;
      }, {});
    }

    const data: IData[] = await Data.find(
      queryParams,
      queryProjection ? {
        _id: 0,
        date: 1,
        ...queryProjection
      } : null,
      {
        sort: {
          date: 1
        }
      }
    );
    return res.status(200).json(data);
  }
  catch(err){
    return res.status(500).json(err);
  }
};

const getLatestData = async (req: Request, res: Response, next: NextFunction) => {
  try{
    let projection: string[] = [];
    let queryProjection: object | undefined = undefined;
    if(req.query.projection){
      if(typeof req.query.projection === 'string'){
        projection.push(req.query.projection);
      }
      else{
        projection = req.query.projection as string[];
      }

      queryProjection = projection.reduce((acc: any, cur: string) => {
        acc[cur] = 1;
        return acc;
      }, {});
    }

    //Try to get locations from query params
    let locations: string[] = req.query.location_code
                              ? (typeof req.query.location_code === 'string'
                              ? [req.query.location_code]
                              : req.query.location_code as string[])
                              : [];

    //Get latest data for each location
    const data: IData[] | null = await LatestData.find(
      locations.length !== 0 ? { location_code: { $in: locations } } : {},
      queryProjection ? {
        _id: 0,
        date: 1,
        location_code: 1,
        ...queryProjection
      } : null,
    );

    return res.status(200).json(data);
  }
  catch(err){
    return res.status(500).json(err);
  }
};

const loadLatestData = async (req: Request, res: Response, next: NextFunction) => {
  try{
    if(!(await accessAllowed(req.headers["authData"], 'admin'))){
      return res.status(403).json({ message: "Forbidden" });
    }

    const result: AxiosResponse = await axios.get(`https://covid.ourworldindata.org/data/latest/owid-covid-latest.csv`);
    const csvStr = result.data;
    let jsonObj = await csv().fromString(csvStr);

    //Remodel data
    jsonObj = jsonObj.map(e => ({
      location_code: e.iso_code,
      date: new Date(e.last_updated_date),
      total_cases: +e.total_cases || undefined,
      new_cases: +e.new_cases || undefined,
      total_deaths: +e.total_deaths || undefined,
      new_deaths: +e.new_deaths || undefined,
      reproduction_rate: +e.reproduction_rate || undefined,
      icu_patients: +e.icu_patients || undefined,
      hosp_patients: +e.hosp_patients || undefined,
      weekly_icu_admissions: +e.weekly_icu_admissions || undefined,
      weekly_hosp_admissions: +e.weekly_hosp_admissions || undefined,
      total_tests: +e.total_tests || undefined,
      new_tests: +e.new_tests || undefined,
      positive_rate: +e.positive_rate || undefined,
      test_units: +e.test_units || undefined,
      total_vaccinations: +e.total_vaccinations || undefined,
      people_vaccinated: +e.people_vaccinated || undefined,
      people_fully_vaccinated: +e.people_fully_vaccinated || undefined,
      total_boosters: +e.total_boosters || undefined,
      new_vaccinations: +e.new_vaccinations || undefined,
      stringency_index: +e.stringency_index || undefined
    }));

    //Save to DB
    jsonObj.forEach(async e => {
      //Update data in all data
      await Data.updateOne({ location_code: e.location_code, date: e.date }, e, { upsert: true });
      //Update data in latest data (update date too)
      await LatestData.updateOne({ location_code: e.location_code }, e, { upsert: true });
    });

    return res.status(200).json(jsonObj);
  }
  catch(err){
    return res.status(500).json(err);
  }
};

const loadAllData = async (req: Request, res: Response, next: NextFunction) => {
  try{
    if(!(await accessAllowed(req.headers["authData"], 'admin'))){
      return res.status(403).json({ message: "Forbidden" });
    }
    
    const result: AxiosResponse = await axios.get(`https://covid.ourworldindata.org/data/owid-covid-data.csv`);
    const csvStr = result.data;
    let jsonObj = await csv().fromString(csvStr);

    //Remodel data
    jsonObj = jsonObj.map(e => ({
      location_code: e.iso_code,
      date: new Date(e.date),
      total_cases: +e.total_cases || undefined,
      new_cases: +e.new_cases || undefined,
      total_deaths: +e.total_deaths || undefined,
      new_deaths: +e.new_deaths || undefined,
      reproduction_rate: +e.reproduction_rate || undefined,
      icu_patients: +e.icu_patients || undefined,
      hosp_patients: +e.hosp_patients || undefined,
      weekly_icu_admissions: +e.weekly_icu_admissions || undefined,
      weekly_hosp_admissions: +e.weekly_hosp_admissions || undefined,
      total_tests: +e.total_tests || undefined,
      new_tests: +e.new_tests || undefined,
      positive_rate: +e.positive_rate || undefined,
      test_units: +e.test_units || undefined,
      total_vaccinations: +e.total_vaccinations || undefined,
      people_vaccinated: +e.people_vaccinated || undefined,
      people_fully_vaccinated: +e.people_fully_vaccinated || undefined,
      total_boosters: +e.total_boosters || undefined,
      new_vaccinations: +e.new_vaccinations || undefined,
      stringency_index: +e.stringency_index || undefined
    }));

    //Save to DB with bulk operation
    const bulkOp = Data.collection.initializeUnorderedBulkOp();
    jsonObj.forEach(e => {
      bulkOp.find({ location_code: e.location_code, date: e.date }).upsert().replaceOne(e);
    });
    await bulkOp.execute();

    //Remodel response
    jsonObj = jsonObj.map(e => ({
      location_code: e.location_code,
      date: moment(e.date).format('YYYY-MM-DD'),
      total_cases: e.total_cases,
    }));
    return res.status(200).json(jsonObj);
  }
  catch(err){
    return res.status(500).json(err);
  }
};

export default { getData, getLatestData, loadLatestData, loadAllData };
