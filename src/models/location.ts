import mongoose from "mongoose";

const LocationTypes = [
  "country",
  "region",
  "other",
  "owidcat"
];
export type LocationType = typeof LocationTypes[number];

export interface ILocation {
  code: string;
  continent?: string;
  name: string;
  type: LocationType;
  population?: number;
  population_density?: number;
  median_age?: number;
  aged_65_older?: number;
  hospital_beds_per_thousand?: number;
}

const LocationSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
    unique: true,
  },
  continent: {
    type: String,
    required: false,
  },
  name: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
    enum: LocationTypes,
  },
  population: {
    type: Number,
    required: false,
  },
  population_density: {
    type: Number,
    required: false,
  },
  median_age: {
    type: Number,
    required: false,
  },
  aged_65_older: {
    type: Number,
    required: false,
  },
  hospital_beds_per_thousand: {
    type: Number,
    required: false,
  },
});

const Location = mongoose.model<ILocation>("Location", LocationSchema);
export default Location;
