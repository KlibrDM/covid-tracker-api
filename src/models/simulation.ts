import mongoose from "mongoose";

export type SimulationParameters = {
  simStartDate: Date;
  simDays: number;
}

export interface ISimulationParameter {
  key: string;
  value: number;
}

export interface ISimulationQuery {
  ownerId: string;
  location_code: string;
  start_date: Date;
  dataset_location_codes: string[];
  simulation_parameters: ISimulationParameter[];
}

export interface ISimulation {
  ownerId: string;
  is_public: boolean;
  name: string;
  location_code: string;
  start_date: Date;
  dataset_location_codes: string[];
  simulation_parameters: ISimulationParameter[];
  total_cases: number[];
  new_cases: number[];
  total_deaths: number[];
  new_deaths: number[];
}

const DataSchema = new mongoose.Schema({
  ownerId: {
    type: String,
    required: true,
  },
  is_public: {
    type: Boolean,
    required: true,
  },
  name: {
    type: String,
    required: true,
    maxLength: 250,
  },
  location_code: {
    type: String,
    required: true,
  },
  start_date: {
    type: Date,
    required: true,
  },
  simulation_parameters: {
    type: [{
      key: {
        type: String,
        required: true,
      },
      value: {
        type: Number,
        required: true,
      },
    }],
    required: true,
  },
  total_cases: {
    type: [Number],
    required: false,
  },
  new_cases: {
    type: [Number],
    required: false,
  },
  total_deaths: {
    type: [Number],
    required: false,
  },
  new_deaths: {
    type: [Number],
    required: false,
  },
});

const Simulation = mongoose.model<ISimulation>("Simulation", DataSchema);
export default Simulation;
