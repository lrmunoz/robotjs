$(document).ready(function () {
  $('button:contains("Generate")').click(function(e) {
    let validRows = isValidInput($("#rows"));
    let validColumns = isValidInput($("#columns"));
    if (validRows && validColumns) {
      resetInputValidation();
      $("#empty-grid").hide();
      $("#grid").show();
      generateGrid();
    } else {

    }
  });
  $('button:contains("Start")').click(function(e) {
  });
});

function isValidInput(element) {
  if (element.is(":valid")) {
    $(element).closest(".validation-container").removeClass("has-error");
    return true;
  } else {
    $(element).closest(".validation-container").addClass("has-error");
    $(".validation-explanation").show();
    return false;
  }
}

function resetInputValidation() {
  $(".validation-container").removeClass("has-error");
  $(".validation-explanation").hide();
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
      tr.appendChild(document.createElement("td"));
    }
  }
}