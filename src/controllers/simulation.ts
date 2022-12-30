import { Request, Response, NextFunction } from 'express';
import { Data, IData } from '../models/data';
import { ISimulation, ISimulationQuery, SimulationParameters } from '../models/simulation';
import moment from 'moment';
import { fourteenDayAverage } from '../utils/functions';
import * as _ from 'lodash';

const runSimulation = async (req: Request, res: Response, next: NextFunction) => {
  try{
    const sim = req.body as ISimulationQuery;
    const simResult: ISimulation = {
      ownerId: sim.ownerId,
      is_public: false,
      name: 'New Simulation',
      location_code: sim.location_code,
      start_date: sim.start_date,
      dataset_location_codes: sim.dataset_location_codes,
      simulation_parameters: sim.simulation_parameters,
      total_cases: [],
      new_cases: [],
      total_deaths: [],
      new_deaths: [],
    }

    //Load parameters
    const parameters: SimulationParameters = {
      simStartDate: sim.start_date,
      simDays: sim.simulation_parameters.find(e => e.key === 'simulation_days')?.value || 120
    }

    //Load data for sim location
    const sourceDataset = await Data.find({ location_code: sim.location_code });

    //Load data for sim datasets
    const simDatasets: IData[][] = [];
    for(let i = 0; i < sim.dataset_location_codes.length; i++){
      const dataset = await Data.find({ location_code: sim.dataset_location_codes[i] });
      simDatasets.push(dataset);
    }

    simResult.new_cases = simulateData('new_cases', parameters, sourceDataset, simDatasets);
    simResult.total_cases = calculateData('total_cases', parameters, sourceDataset, simResult.new_cases);
    simResult.new_deaths = simulateData('new_deaths', parameters, sourceDataset, simDatasets);
    simResult.total_deaths = calculateData('total_deaths', parameters, sourceDataset, simResult.new_deaths);

    return res.status(200).json(simResult);
  }
  catch(err){
    return res.status(500).json(err);
  }
};

const simulateData = (type: 'new_cases' | 'new_deaths', parameters: SimulationParameters, source: IData[], data: IData[][]) => {
  //Create deep copy of data
  let sourceCopy = _.cloneDeep(source);
  let dataCopy = _.cloneDeep(data);

  //Delete everything after the start date
  if(moment(sourceCopy[sourceCopy.length - 1].date).isAfter(moment(parameters.simStartDate))){
    sourceCopy = sourceCopy.splice(0, sourceCopy.findIndex(e => moment(e.date).isSameOrAfter(moment(parameters.simStartDate))));
    dataCopy = dataCopy.map(e => e.splice(0, e.findIndex(e => moment(e.date).isSameOrAfter(moment(parameters.simStartDate)))));
  }

  //Change all to 14 day averages
  const sourceData = fourteenDayAverage(sourceCopy.map(e => e[type] || 0));
  const simData = dataCopy.map(e => fourteenDayAverage(e.map(e => e[type] || 0)));

  const lastDay = sourceData[sourceData.length - 1];
  const lastDays = sourceData.slice(sourceData.length - 30, sourceData.length);

  const min = Math.min(...lastDays);
  const max = Math.max(...lastDays);

  const differenceRate = max / min;

  let closestDifferenceRate: number | undefined;
  let closestDifferenceEndIndex: number | undefined;
  let closestDifferenceDatasetIndex: number | undefined;

  simData.forEach((dataset, datasetIndex) => {
    for(let i = 0; i < dataset.length - (parameters.simDays + 30); i += 5) {
      const datasetLastDays = dataset.slice(i, i + 30);
      const datasetMin = Math.min(...datasetLastDays);
      const datasetMax = Math.max(...datasetLastDays);
      const datasetDifferenceRate = datasetMax / datasetMin;

      if(closestDifferenceRate === undefined){
        closestDifferenceRate = Math.abs(differenceRate - datasetDifferenceRate);
        closestDifferenceEndIndex = i + 30;
        closestDifferenceDatasetIndex = datasetIndex;
      }
      else{
        if(Math.abs(differenceRate - datasetDifferenceRate) < closestDifferenceRate){
          closestDifferenceRate = Math.abs(differenceRate - datasetDifferenceRate);
          closestDifferenceEndIndex = i + 30;
          closestDifferenceDatasetIndex = datasetIndex;
        }
      }
    }
  });

  //Find the next days from the closest dataset
  const datasetNextDays = [];
  let datasetBaseline = 1;
  if(closestDifferenceEndIndex){
    datasetBaseline = simData[closestDifferenceDatasetIndex!][closestDifferenceEndIndex] || 1;
    for(let i = closestDifferenceEndIndex + 1; i <= closestDifferenceEndIndex + parameters.simDays; i++){
      datasetNextDays.push(simData[closestDifferenceDatasetIndex!][i]);
    }
  }

  //Calculate percentage variance of the next days
  const datasetNextDaysVariance = datasetNextDays.map(e => e / datasetBaseline);

  //Calculate the next sim days
  const simNextDays = datasetNextDaysVariance.map(e => Math.round(e * lastDay));

  return simNextDays;
}

const calculateData = (type: 'total_cases' | 'total_deaths', parameters: SimulationParameters, source: IData[], newValues: number[]) => {
  let latestValue = source[source.length - 1][type] || 0;
  const simNextTotals: number[] = [];

  newValues.forEach(num => {
    latestValue += num;
    simNextTotals.push(latestValue);
  });

  return simNextTotals;
}

export default { runSimulation };
