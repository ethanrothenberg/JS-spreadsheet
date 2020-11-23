##Web based spreadsheet!

```
A web based spreadsheet which accepts numbers, strings, and formulas into its cells. Formulas are of the format
 =x+y, =x-y, =x*y, =x/y, =AVG(x,y), =SUM(x,y), where x and y are either numbers or cell references. The sheet
 also accepts more than just two terms for formulas. if a cell referenced in a formula changes, the cell with
 that formula changes as well. If you click on a cell that was calculated using the formula, you can edit the
 formula. if you click away without editing, the formula will remain and you can click back to the cell and hit
 enter to calculate it. Dividing by 0, referencing a string in a formula, or referencing your own cell results
 in the cell returning a value of INVALID OPERATION.



```
##Running the tests

```
Using Jest. One of the tests right now is commented out because it references the DOM in it and Jest didn't
like that, but if I comment out the line in the function that is being tested, the test passes. I just used
the test for testing the logic of the function but it stopped working once the DOM got referenced.

cd sheet
npm install
npm run test

```

## Building the spreadsheet

```
You can access the spreadsheet at the link below, but can also build using these steps after cloning.

cd sheet
npm install
npm run build

```
[Working Spreadsheet](https://ethanrothenberg.github.io/JS-spreadsheet/sheet/)
