function sum(numsToSum) {
  let result = 0;
  let index = 0;
  while (index < numsToSum.length) {
    result += Number(numsToSum[index]);
    index++;
  }
  return result;
}

function avg(numsToAverage) {
  let result = 0;
  const size = numsToAverage.length;
  for (let i = 0; i < size; i++) {
    result += Number(numsToAverage[i]);
  }
  result = result / size;
  return result;
}

module.exports = { sum, avg };
