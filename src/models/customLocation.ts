import mongoose from "mongoose";

export interface ICustomLocation {
  ownerId: string;
  is_public: boolean;
  code: string;
  name: string;
  parent_code?: string;
  available_indicators?: string[];
  population?: number;
  population_density?: number;
  median_age?: number;
  aged_65_older?: number;
  hospital_beds_per_thousand?: number;
  gdp_per_capita?: number;
  life_expectancy?: number;
}

const CustomLocationSchema = new mongoose.Schema({
  ownerId: {
    type: String,
    required: true,
  },
  is_public: {
    type: Boolean,
    required: true,
  },
  code: {
    type: String,
    required: true,
    unique: true,
    maxLength: 8,
  },
  name: {
    type: String,
    required: true,
    maxLength: 250,
  },
  parent_code: {
    type: String,
    required: false,
  },
  available_indicators: {
    type: [String],
    required: false,
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
  gdp_per_capita: {
    type: Number,
    required: false,
  },
  life_expectancy: {
    type: Number,
    required: false,
  },
});

CustomLocationSchema.set('timestamps', true);

const CustomLocation = mongoose.model<ICustomLocation>("CustomLocation", CustomLocationSchema);
export default CustomLocation;
