export const sevenDayAverage = (data: any) => {
  const average = [];
  for (let i = 0; i < data.length; i++) {
    const x1 = i - 6 < 0 ? 0 : i - 6;
    const x2 = i + 1;
    const dist = x2 - x1;
    const sum = dist !== 0 ? data.slice(x1, x2).reduce((a: number, b: number) => a + b, 0) : data[x1];
    const avg = dist !== 0 ? sum / dist : sum;
    average.push(Math.round(avg));
  }
  return average;
};

export const fourteenDayAverage = (data: any) => {
  const average = [];
  for (let i = 0; i < data.length; i++) {
    const x1 = i - 13 < 0 ? 0 : i - 13;
    const x2 = i + 1;
    const dist = x2 - x1;
    const sum = dist !== 0 ? data.slice(x1, x2).reduce((a: number, b: number) => a + b, 0) : data[x1];
    const avg = dist !== 0 ? sum / dist : sum;
    average.push(Math.round(avg));
  }
  return average;
};
