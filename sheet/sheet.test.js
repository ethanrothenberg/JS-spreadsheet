const {
  sheet,
  accessCell,
  recalculateDependentCells,
  parseFormula,
  removeWhiteSpace,
  handleCellReferences,
} = require("./src/parsing");
const {
  isValidColIndex,
  isValidRowIndex,
  isValidFormula,
  isValidIndex,
} = require("./src/validityChecking");
const { sum, avg } = require("./src/operations");

test("accessCell returns cell if it exists and creates empty cell if the cell does not yet exist", () => {
  cellRelianceConstructor();
  let cell = accessCell("Z1");
  expect(cell).toMatchObject({ formula: "", reliedOnBy: [], value: "" });
  cell.formula = "=Z1+A4";
  cell.value = "34";
  expect(accessCell("Z1")).toMatchObject({
    formula: "=Z1+A4",
    reliedOnBy: [],
    value: "34",
  });
});

/*test('recalculateDependentCells successfully recalculates cells that depend on a given cell when that cell changes', () =>{
  let cellF1 = accessCell('F1');
  cellF1.reliedOnBy.push('G1');
  cellF1.reliedOnBy.push('H1');
  cellF1.value = 0;
  let cellG1 = accessCell('G1');
  cellG1.formula = '=F1+2';
  cellG1.value = 3;
  let cellH1 = accessCell('H1');
  cellH1.formula = '=1+G1 + F1';
  cellH1.value = 5;
  expect(cellG1.value).toBe(3);
  expect(cellH1.value).toBe(5);
  recalculateDependentCells('F1');
  expect(cellG1.value).toBe(2);
  expect(cellH1.value).toBe(3);
});
*/

test("adds 1 + 2 to equal 3", () => {
  expect(sum([1, 2])).toBe(3);
});

test("averages 2, 4, and 6 to equal 4", () => {
  expect(avg([2, 4, 6])).toBe(4);
  expect(avg(["40", "-90", "2.5"])).toBe(-47.5 / 3);
});

test("when passes formulas, isFormula recognizes those that are and arent", () => {
  expect(isValidFormula(" =3+2")).toBeTruthy();
  expect(isValidFormula("bib+o")).toBeFalsy();
  expect(isValidFormula("=35")).toBeFalsy();
});

test("when passes formulas, isFormula regognizes formulas regardless of spacing", () => {
  expect(isValidFormula("      =  3    +   2")).toBeTruthy();
  expect(isValidFormula("   3  +2")).toBeFalsy();
});

test("when passed invalid table index, isValidIndex regognizes it is not valid", () => {
  expect(isValidIndex("Ao3")).toBeFalsy();
  expect(isValidIndex("b50")).toBeFalsy();
  expect(isValidIndex("AA50")).toBeFalsy();
  expect(isValidIndex("51")).toBeFalsy();
  expect(isValidIndex("B")).toBeFalsy();
});

test("when passed valid table index, isValidIndex regognizes it is valid", () => {
  expect(isValidIndex("A3")).toBeTruthy();
  expect(isValidIndex("Z50")).toBeTruthy();
  expect(isValidIndex("A1")).toBeTruthy();
  expect(isValidIndex("X5")).toBeTruthy();
  expect(isValidIndex("B11")).toBeTruthy();
});

test("when passed valid row index, isValidRowIndex regognizes it is valid", () => {
  expect(isValidRowIndex("1")).toBeTruthy();
  expect(isValidRowIndex("50")).toBeTruthy();
  expect(isValidRowIndex("51")).toBeFalsy();
  expect(isValidRowIndex("2.3")).toBeFalsy();
  expect(isValidRowIndex("3.0")).toBeFalsy();
  expect(isValidRowIndex(-23)).toBeFalsy();
  expect(isValidRowIndex(0)).toBeFalsy();
});
test("when passed valid col index, isValidColIndex regognizes it is valid", () => {
  expect(isValidColIndex("A")).toBeTruthy();
  expect(isValidColIndex("Z")).toBeTruthy();
  expect(isValidColIndex("E")).toBeTruthy();
  expect(isValidColIndex("e")).toBeFalsy();
  expect(isValidColIndex("2")).toBeFalsy();
});

test("when given + expression parseFormula returns correct result", () => {
  expect(parseFormula("=3+2")).toBe(5);
  expect(parseFormula("=   3 + 2")).toBe(5);
  expect(parseFormula("=2 + 11.324 + 2")).toBe(15.324);
  expect(parseFormula("=1 + 39")).toBe(40);
});
test("when given - expression parseFormula returns correct result", () => {
  expect(parseFormula("=3-2")).toBe(1);
  expect(parseFormula("=   3 - 2")).toBe(1);
  expect(parseFormula("=2 - 11 - 2")).toBe(-11);
  expect(parseFormula("=1 - 39.32")).toBe(-38.32);
});
test("when given * expression parseFormula returns correct result", () => {
  expect(parseFormula("=3*2")).toBe(6);
  expect(parseFormula("=   3 * 2")).toBe(6);
  expect(parseFormula("=2 * 11 * 2.5")).toBe(55);
  expect(parseFormula("=1 * 39")).toBe(39);
});
test("when given / expression parseFormula returns correct result", () => {
  expect(parseFormula("=3/2")).toBe(1.5);
  expect(parseFormula("=   3 / 2")).toBe(1.5);
  expect(parseFormula("=2 / 10 / 2")).toBe(0.1);
  expect(parseFormula("= 1 / 39")).toBe(1 / 39);
});

test("when given AVG expression parseFormula returns correct result", () => {
  expect(parseFormula("=AVG(40, -90, 2.5)")).toBe(-47.5 / 3);
  expect(parseFormula("=AVG(3,2)")).toBe(2.5);
  expect(parseFormula("=AVG(   3 , 2)  ")).toBe(2.5);
  expect(parseFormula("=AVG(5,5,5,5,5,5)")).toBe(5);
});

test("parseFormula calculates expressions with cell references in them", () => {
  cellRelianceConstructor();
  expect(parseFormula("=AVG(A1,10)")).toBe(5.5);
  expect(parseFormula("=3+4+B1")).toBe(9);
});

test("parseFormula returns INVALID OPERATION, if it is passed a reference to a string", () => {
  cellRelianceConstructor();
  accessCell("A1").value = "value";
  expect(parseFormula("=AVG(A1,10)")).toBe("INVALID OPERATION");
});

test("removeWhiteSpace removes all white space from string", () => {
  expect(removeWhiteSpace("=   3   +  2")).toBe("=3+2");
  expect(removeWhiteSpace("   = 3  +2       ")).toBe("=3+2");
  expect(removeWhiteSpace("=3+2")).toBe("=3+2");
  expect(removeWhiteSpace("=3+2               ")).toBe("=3+2");
  expect(removeWhiteSpace("       =3   +  2")).toBe("=3+2");
});

test("handleCellReferences handles array of cells and values and returns array of only values", () => {
  let cells = cellRelianceConstructor();
  expect(handleCellReferences(["A1", "B1", "C1", 45], "D1")).toMatchObject([
    1,
    2,
    3,
    45,
  ]);
});

test("handleCellReferences handles array of cells and values and puts cell references in parents reliedOnBy array", () => {
  cellRelianceConstructor();
  handleCellReferences(["A1", "B1", "C1", 45], "D1");
  expect(accessCell("A1").reliedOnBy).toMatchObject(["D1"]);
  expect(accessCell("B1").reliedOnBy).toMatchObject(["D1"]);
  expect(accessCell("C1").reliedOnBy).toMatchObject(["D1"]);
});

test("handleCellReferences handles array of cells and values and returns null if any cell referenced does not contain a number", () => {
  let cells = cellRelianceConstructor();
  cells[0].value = "not a number!";
  expect(handleCellReferences(["A1", "B1", "C1", 45], "D1")).toBe(null);
});

function cellRelianceConstructor() {
  let cellA1 = accessCell("A1");
  cellA1.reliedOnBy = [];
  let cellB1 = accessCell("B1");
  cellB1.reliedOnBy = [];
  let cellC1 = accessCell("C1");
  cellC1.reliedOnBy = [];
  let cellD1 = accessCell("D1");
  cellA1.value = 1;
  cellB1.value = 2;
  cellC1.value = 3;
  return [cellA1, cellB1, cellC1, cellD1];
}
