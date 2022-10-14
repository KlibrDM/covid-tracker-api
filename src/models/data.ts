import mongoose from "mongoose";

export interface IData {
  location_code: string;
  date: Date;
  total_cases?: number;
  new_cases?: number;
  total_deaths?: number;
  new_deaths?: number;
  reproduction_rate?: number;
  icu_patients?: number;
  hosp_patients?: number;
  weekly_icu_admissions?: number;
  weekly_hosp_admissions?: number;
  total_tests?: number;
  new_tests?: number;
  positive_rate?: number;
  test_units?: string;
  total_vaccinations?: number;
  people_vaccinated?: number;
  people_fully_vaccinated?: number;
  total_boosters?: number;
  new_vaccinations?: number;
  stringency_index?: number;
}

const DataSchema = new mongoose.Schema({
  location_code: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  total_cases: {
    type: Number,
    required: false,
  },
  new_cases: {
    type: Number,
    required: false,
  },
  total_deaths: {
    type: Number,
    required: false,
  },
  new_deaths: {
    type: Number,
    required: false,
  },
  reproduction_rate: {
    type: Number,
    required: false,
  },
  icu_patients: {
    type: Number,
    required: false,
  },
  hosp_patients: {
    type: Number,
    required: false,
  },
  weekly_icu_admissions: {
    type: Number,
    required: false,
  },
  weekly_hosp_admissions: {
    type: Number,
    required: false,
  },
  total_tests: {
    type: Number,
    required: false,
  },
  new_tests: {
    type: Number,
    required: false,
  },
  positive_rate: {
    type: Number,
    required: false,
  },
  test_units: {
    type: String,
    required: false,
  },
  total_vaccinations: {
    type: Number,
    required: false,
  },
  people_vaccinated: {
    type: Number,
    required: false,
  },
  people_fully_vaccinated: {
    type: Number,
    required: false,
  },
  total_boosters: {
    type: Number,
    required: false,
  },
  new_vaccinations: {
    type: Number,
    required: false,
  },
  stringency_index: {
    type: Number,
    required: false,
  },
});

DataSchema.index({
  location_code: 1,
  date: 1,
});

export const Data = mongoose.model<IData>("Data", DataSchema);
export const LatestData = mongoose.model<IData>("LatestData", DataSchema);
