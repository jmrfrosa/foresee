export const average = (list) => {
  return list.reduce((total, element) => (total + element), 0) / list.length;
}

export const randomColor = () => {
  return parseInt(Math.floor(Math.random()*16777215).toString(16), 16);
}

export const rangeFit = (value, vMin, vMax, nMin, nMax) => {
  return (nMax - nMin)*(value - vMin)/(vMax - vMin) + nMin;
}