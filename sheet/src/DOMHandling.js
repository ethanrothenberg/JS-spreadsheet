const {
  accessCell,
  removeWhiteSpace,
  parseFormula,
  recalculateDependentCells,
} = require("./parsing");
const { isValidFormula } = require("./validityChecking");
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
