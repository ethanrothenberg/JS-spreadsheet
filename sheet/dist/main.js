/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ 791:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const {
  accessCell,
  removeWhiteSpace,
  parseFormula,
  recalculateDependentCells,
} = __webpack_require__(907);
const { isValidFormula } = __webpack_require__(220);
// When input is changed or enter is hit on cell, this is called to update the sheet
function addInputToArray(event) {
  const element = event.target;
  const cellID = element.id;
  const cell = accessCell(cellID);
  if (!isValidFormula(element.value)) {
    cell.value = element.value;
    if (cell.formula) {
      cell.formula = "";
      element.removeEventListener("focusin", displayFormula);
    }
  } else {
    if (cell.formula === "") {
      element.addEventListener("focusin", displayFormula);
    }
    cell.formula = removeWhiteSpace(element.value);
    cell.value = parseFormula(cell.formula, element.id);
    element.value = cell.value;
  }
  recalculateDependentCells(cellID);
}

//Called when cell with formula is clicked and displays the formula instead of the result
function displayFormula(event) {
  const element = event.target;
  const cellID = element.id;
  const cell = accessCell(cellID);
  cellFormula = cell.formula;
  if (cellFormula) {
    element.value = cellFormula;
  }
}
//if a user presses enter, this checks if its value is a valid formula. If so it adds it to the array, if not it does nothing
function handleEnterInput(event) {
  const element = event.target;
  if (isValidFormula(element.value)) {
    addInputToArray(event);
  }
}

module.exports = { addInputToArray, displayFormula, handleEnterInput };


/***/ }),

/***/ 247:
/***/ ((module) => {

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


/***/ }),

/***/ 907:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const { sum, avg } = __webpack_require__(247);
const {
  addInputToArray,
  displayFormula,
  handleEnterInput,
} = __webpack_require__(791);
const {
  isValidFormula,
  isValidIndex,
  removeWhiteSpace,
} = __webpack_require__(220);

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


/***/ }),

/***/ 220:
/***/ ((module) => {

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


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		if(__webpack_module_cache__[moduleId]) {
/******/ 			return __webpack_module_cache__[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
(() => {
const { addInputToArray, handleEnterInput } = __webpack_require__(791);

const inputElements = Array.from(document.getElementsByTagName("input"));
inputElements.forEach((element) => {
  element.addEventListener("keyup", function (event) {
    if (event.keyCode === 13) {
      handleEnterInput(event);
    }
  });
  element.addEventListener("change", addInputToArray);
});

})();

/******/ })()
;