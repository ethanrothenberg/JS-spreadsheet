const { addInputToArray, handleEnterInput } = require("./DOMHandling");

const inputElements = Array.from(document.getElementsByTagName("input"));
inputElements.forEach((element) => {
  element.addEventListener("keyup", function (event) {
    if (event.keyCode === 13) {
      handleEnterInput(event);
    }
  });
  element.addEventListener("change", addInputToArray);
});
