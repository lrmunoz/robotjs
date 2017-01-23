$(document).ready(function () {
  $('button:contains("Generate")').click(function(e) {
    if (isValidInputGridGeneration()) {
      $("#empty-grid").hide();
      $("#grid").show();
      generateGrid();
    }
  });
  document.addEventListener("click", function(e) {
    if (e.target.tagName === 'TD') {
      if ($(e.target).hasClass("cell-set")) {
        $(e.target).removeClass();
      } else {
        $(e.target).addClass("cell-set");
        let type = getSelectedElementType();
        if (type === 'start') {
          $(".start").removeClass();
          $(e.target).addClass("start");
        } else if (type === 'end') {
          $(".end").removeClass();
          $(e.target).addClass("end");
        } else if (type === 'obstacle') {
          $(e.target).addClass("obstacle");
        } else {
          console.log("Unknown element type: " + type);
        }
      }
    }
  });
  $('button:contains("Start")').click(function(e) {
    let validInputGridGeneration = isValidInputGridGeneration();
    let gridGenerated = isGridGenerated();
    let correctElements = gridHasCorrectElements();
    if (validInputGridGeneration && gridGenerated && correctElements) {
      runAlgorithm();
    }
  });
  $('button:contains("Reset")').click(function(e) {
    $(".result-message").hide();
    $("#grid table td.visited").removeClass("visited");
  });
});

function runAlgorithm() {
  let start = findCellWithClass("start");
  let end = findCellWithClass("end");
  let grid = initGrid();
  $("#success").hide();
  $("#failure").hide();
  let algorithm = new BlindWalkAlgorithm();
  let path = algorithm.moveRobot(grid, start, end, function(current, previous) {
    console.log(`row: ${current.row}, column: ${current.column}`);
  });
  if (path) {
    path.forEach(function(point) {
      let cell = $(`#grid table td[custom_attr_row="${point.row}"][custom_attr_column="${point.column}"]`);
      cell.addClass("visited");
      $("#success").show();
    });
  } else {
    $("#failure").show();
  }
}

function findCellWithClass(className) {
  var coordinates = null;
  let cell = $(`#grid table td.${className}`);
  if (cell.length === 1) {
    let row = cell.attr("custom_attr_row");
    let column = cell.attr("custom_attr_column");
    coordinates = {row: parseInt(row), column: parseInt(column)};
  }
  return coordinates;
}

function initGrid() {
  let rows = $("#rows").val();
  let columns = $("#columns").val();
  let grid = [];
  for (var i = 0; i < rows; i++) {
    let row = [];
    grid.push(row);
    for (var j = 0; j < columns; j++) {
      let cell = $(`#grid table td[custom_attr_row="${i}"][custom_attr_column="${j}"]`);
      if (cell.hasClass("obstacle")) {
        row.push(1);
      } else {
        row.push(0);
      }
    }
  }
  return grid;
}

function getSelectedElementType() {
  return $("input[name='cellType']:checked").val();
}

function isValidInputGridGeneration() {
  let validRows = isValidInput($("#rows"));
  let validColumns = isValidInput($("#columns"));
  if (validRows && validColumns) {
    resetInputValidation($("#rows"));
    return true;
  } else {
    return false;
  }
}

function isGridGenerated() {
  let validationContainer = $($("#rows")).closest(".validation-container");
  let grid = $("#grid table");
  if (grid.length === 0) {
    validationContainer.addClass("has-error");
    validationContainer.nextAll(".validation-explanation").show();
    return false;
  } else {
    validationContainer.removeClass("has-error");
    return true;
  }
}

function gridHasCorrectElements() {
  var valid = false;
  let start = findCellWithClass("start");
  let end = findCellWithClass("end");
  let element = $("input[name='cellType'][value='start']");
  if (start && end) {
    resetInputValidation(element);
    valid = true;
  } else {
    let validationContainer = $(element).closest(".validation-container");
    validationContainer.addClass("has-error");
    validationContainer.nextAll(".validation-explanation").show();
    valid = false;
  }
  return valid;
}

function isValidInput(element) {
  let validationContainer = $(element).closest(".validation-container");
  if (element.is(":valid")) {
    validationContainer.removeClass("has-error");
    return true;
  } else {
    validationContainer.addClass("has-error");
    validationContainer.nextAll(".validation-explanation").show();
    return false;
  }
}

function resetInputValidation(element) {
  let validationContainer = $(element).closest(".validation-container");
  validationContainer.removeClass("has-error");
  validationContainer.nextAll(".validation-explanation").hide();
}

function generateGrid() {
  let rows = $("#rows").val();
  let columns = $("#columns").val();
  $("#grid").empty();
  let grid = document.getElementById("grid");
  let table = document.createElement("table");
  grid.appendChild(table);
  for (var i = 0; i < rows; i++) {
    let tr = document.createElement("tr");
    table.appendChild(tr);
    for (var j = 0; j < columns; j++) {
      let td = document.createElement("td");
      td.setAttribute("custom_attr_row", i);
      td.setAttribute("custom_attr_column", j);
      tr.appendChild(td);
    }
  }
}