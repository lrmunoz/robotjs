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
  document.addEventListener("click", function(e) {
    if (e.target.tagName === 'TD') {
      let row = e.target.getAttribute("custom_attr_row");
      let column = e.target.getAttribute("custom_attr_column");
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
  });
});

function getSelectedElementType() {
  return $("input[name='cellType']:checked").val();
}

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
      let td = document.createElement("td");
      td.setAttribute("custom_attr_row", i);
      td.setAttribute("custom_attr_column", j);
      tr.appendChild(td);
    }
  }
}