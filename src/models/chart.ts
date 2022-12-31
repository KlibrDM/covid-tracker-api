import mongoose from "mongoose";

const ChartTypes = [
  "line",
  "area",
  "bar"
];
export type ChartType = "line" | "area" | "bar";

export interface IChartAreaFill {
  target: string,
  above: string,
  below: string
}

export interface IIndicator {
  key: string;
  label: string;
  per_million?: boolean;
  average?: 7 | 14;
}

export interface IChartValue {
  indicator: IIndicator;
  location_code: string;
  is_custom_location?: boolean;
  chart_type: "area" | "line" | "bar";
  color: string;
  fill?: IChartAreaFill;
}

export interface IChart {
  ownerId: string;
  is_public: boolean;
  name: string;
  start_date: Date;
  end_date: Date;
  values: IChartValue[];
}

const ChartSchema = new mongoose.Schema({
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
  start_date: {
    type: Date,
    required: true,
  },
  end_date: {
    type: Date,
    required: true,
  },
  values: {
    type: [{
      indicator: {
        key: {
          type: String,
          required: true,
        },
        label: {
          type: String,
          required: true,
        },
        per_million: {
          type: Boolean,
          required: false,
        },
        average: {
          type: Number,
          required: false,
        }
      },
      location_code: {
        type: String,
        required: true,
      },
      is_custom_location: {
        type: Boolean,
        required: false,
      },
      chart_type: {
        type: String,
        required: true,
        enum: ChartTypes,
      },
      color: {
        type: String,
        required: true,
      },
      fill: {
        type: {
          target: {
            type: String,
            required: true,
          },
          above: {
            type: String,
            required: true,
          },
          below: {
            type: String,
            required: true,
          },
        },
        required: false,
      },
    }],
    required: true,
  },
});

const Chart = mongoose.model<IChart>("chart", ChartSchema);
export default Chart;
