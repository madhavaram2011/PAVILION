/**
 * Climate helper — generates 12-month climate arrays from compact data.
 * Usage: mc([minTemp,maxTemp,rainfall,'Season'], ... x12)
 */
const MONTHS = [
  'January','February','March','April','May','June',
  'July','August','September','October','November','December'
];

export function mc(...data) {
  return data.map((d, i) => ({
    month: MONTHS[i],
    minTemp: d[0],
    maxTemp: d[1],
    rainfall: d[2],
    season: d[3],
  }));
}
