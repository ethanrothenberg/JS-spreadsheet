//removes white space from formulas, so slight errors in formatting are still readable
function removeWhiteSpace(input) {
  return input.replace(/\s+/g, "").trim();
}

//checks if formula is valid
function isValidFormula(possibleFormula) {
  possibleFormula = removeWhiteSpace(possibleFormula);
  if (
    !possibleFormula.includes("AVG") &&
    !possibleFormula.includes("SUM") &&
    !possibleFormula.includes("+") &&
    !possibleFormula.includes("*") &&
    !possibleFormula.includes("/") &&
    !possibleFormula.includes("-")
  ) {
    return false;
  } else {
    return possibleFormula.charAt(0) == "=";
  }
}

//checks if index is valid
function isValidIndex(index) {
  return isValidRowIndex(index.substring(1)) && isValidColIndex(index);
}

function isValidRowIndex(rowNumber) {
  let parsedNum = parseInt(rowNumber, 10);
  return rowNumber === "" + parsedNum && 0 < parsedNum && parsedNum < 51;
}

function isValidColIndex(cellIndex) {
  let firstChar = cellIndex.charAt(0);
  if (!firstChar.match(/[A-Z]/i)) {
    return false;
  } else {
    return firstChar != firstChar.toLowerCase();
  }
}

module.exports = {
  isValidFormula,
  isValidIndex,
  isValidRowIndex,
  isValidColIndex,
  removeWhiteSpace,
};
