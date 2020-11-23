const { sum, avg } = require("./operations");
const {
  addInputToArray,
  displayFormula,
  handleEnterInput,
} = require("./DOMHandling");
const {
  isValidFormula,
  isValidIndex,
  removeWhiteSpace,
} = require("./validityChecking");

let sheet = {};
//if cell exists this returns it, if not it creates a new cell in the sheet
function accessCell(cellID) {
  if (sheet[cellID] == undefined) {
    sheet[cellID] = { value: "", reliedOnBy: [], formula: "" };
  }
  return sheet[cellID];
}

//when a cell is changed, if any formulas rely on that ccell, those formulas are recalculated and entered into the display
function recalculateDependentCells(cellID) {
  const cell = accessCell(cellID);
  for (index in cell.reliedOnBy) {
    const cellIDToUpdate = cell.reliedOnBy[index];
    const elementToUpdate = document.getElementById(cellIDToUpdate);
    const cellToUpdate = accessCell(cellIDToUpdate);
    const formula = cellToUpdate.formula;
    if (formula.includes(cellID)) {
      cellToUpdate.value = parseFormula(formula, cellIDToUpdate);
      elementToUpdate.value = cellToUpdate.value;
      recalculateDependentCells(cellIDToUpdate);
    } else {
      cell.reliedOnBy.splice(1, index);
    }
  }
}

//takes in formula and the cellID calling that formula and returns the result of the formula, INVALID OPERATION if it is not valid
function parseFormula(formulaWithEquals, cellID) {
  let formula = removeWhiteSpace(formulaWithEquals).substring(1);
  let arrayOfTerms = [];
  let result = 0;
  let index = 1;
  if (formula.includes("(") && formula.includes(")")) {
    formula = formula.slice(0, formula.length - 1);
    arrayOfTerms = formula.split("(");
    let termsInFormula = arrayOfTerms[1].split(",");
    termsInFormula = handleCellReferences(termsInFormula, cellID);
    if (termsInFormula === null) {
      return "INVALID OPERATION";
    } else {
      if (arrayOfTerms[0] == "AVG") {
        return avg(termsInFormula);
      } else if (arrayOfTerms[0] == "SUM") {
        return sum(termsInFormula);
      }
    }
  } else if (formula.includes("+")) {
    arrayOfTerms = formula.split("+");
    arrayOfTerms = handleCellReferences(arrayOfTerms, cellID);
    if (arrayOfTerms === null) {
      return "INVALID OPERATION";
    }
    result = Number(arrayOfTerms[0]);
    while (index < arrayOfTerms.length) {
      result += Number(arrayOfTerms[index]);
      index++;
    }
    return result;
  } else if (formula.includes("-")) {
    arrayOfTerms = formula.split("-");
    arrayOfTerms = handleCellReferences(arrayOfTerms, cellID);
    if (arrayOfTerms === null) {
      return "INVALID OPERATION";
    }
    result = Number(arrayOfTerms[0]);
    while (index < arrayOfTerms.length) {
      result -= Number(arrayOfTerms[index]);
      index++;
    }
    return result;
  } else if (formula.includes("*")) {
    arrayOfTerms = formula.split("*");
    arrayOfTerms = handleCellReferences(arrayOfTerms, cellID);
    if (arrayOfTerms === null) {
      return "INVALID OPERATION";
    }
    result = Number(arrayOfTerms[0]);
    while (index < arrayOfTerms.length) {
      result *= Number(arrayOfTerms[index]);
      index++;
    }
    return result;
  } else if (formula.includes("/")) {
    arrayOfTerms = formula.split("/");
    arrayOfTerms = handleCellReferences(arrayOfTerms, cellID);
    if (arrayOfTerms === null || arrayOfTerms[1] == 0) {
      return "INVALID OPERATION";
    }
    result = Number(arrayOfTerms[0]);
    while (index < arrayOfTerms.length) {
      result /= Number(arrayOfTerms[index]);
      index++;
    }
    return result;
  }
}

//takes in array of terms in a formula and returns the values associated with those terms and also fills out which cells are relied on by the parent
function handleCellReferences(cellIDArray, parentCellID) {
  let isValidForOperation = true;
  let cellValueArray = cellIDArray.map((cellID) => {
    if (!Number(cellID) && cellID != 0) {
      if (isValidIndex(cellID)) {
        const cell = accessCell(cellID);
        const value = cell.value;
        if (!cell.reliedOnBy.includes(parentCellID)) {
          cell.reliedOnBy.push(parentCellID);
        }
        if ((!Number(value) && value != 0) || cellID == parentCellID) {
          isValidForOperation = false;
        }
        return value;
      }
    } else {
      return cellID;
    }
  });
  if (isValidForOperation) {
    return cellValueArray;
  } else {
    return null;
  }
}

module.exports = {
  sheet,
  accessCell,
  recalculateDependentCells,
  parseFormula,
  removeWhiteSpace,
  handleCellReferences,
};
