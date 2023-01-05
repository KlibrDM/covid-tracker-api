import mongoose from "mongoose";
import { IChart } from "./chart";

export interface IReport {
  ownerId: string;
  is_public: boolean;
  name: string;
  charts: IChart[];
}

const ReportSchema = new mongoose.Schema({
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
  charts: {
    type: Array,
    required: true,
  }
});

const Report = mongoose.model<IReport>("report", ReportSchema);
export default Report;
