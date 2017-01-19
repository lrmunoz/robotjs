function moveRobot(grid, start, exit) {
  var current = start;
  var moves = 0;
  var found = false;
  while (!found) {
    console.log(`row: ${current.row}, column: ${current.column}`);
    if (comparePoints(current, exit)) {
      console.log(`Arrived! (moves: ${moves})`);
      return;
    }
    let leftPoint = getLeftPoint(grid, current);
    let rightPoint = getRightPoint(grid, current);
    let upPoint = getUpPoint(grid, current);
    let downPoint = getDownPoint(grid, current);
    let nextPoint = calculateNextPoint([leftPoint, rightPoint, upPoint, downPoint]);
    if (nextPoint === null) {
      console.log(`I'm blocked! (moves: ${moves})`);
      return;
    }
    current = nextPoint;
    moves += 1;
  }
}

function getLeftPoint(grid, point) {
  return offsetPoint(grid, point, {offsetRow: 0, offsetColumn: -1})
}

function getRightPoint(grid, point) {
  return offsetPoint(grid, point, {offsetRow: 0, offsetColumn: 1})
}

function getUpPoint(grid, point) {
  return offsetPoint(grid, point, {offsetRow: -1, offsetColumn: 0})
}

function getDownPoint(grid, point) {
  return offsetPoint(grid, point, {offsetRow: 1, offsetColumn: 0})
}

function offsetPoint(grid, point, offset) {
  let newRow = point.row + offset.offsetRow;
  let newColumn = point.column + offset.offsetColumn;
  if (newRow < 0 || newRow > grid.length - 1) return null;
  if (newColumn < 0 || newColumn > grid[0].length - 1) return null;
  let newPoint = {row: newRow, column: newColumn};
  if (getIsObstacle(grid, newPoint)) return null;
  return newPoint;
}

function getIsObstacle(grid, point) {
  return grid[point.row][point.column] === 1;
}

function comparePoints(p1, p2) {
  if (p1.row === p2.row && p1.column === p2.column) return true
  return false
}

function calculateNextPoint(candidates) {
  let cleanCandidates = candidates.filter(function(candidate) { return candidate !== null; });
  if (cleanCandidates.length === 0) return null;
  let randomCandidateIndex = getRandomIntInclusive(0, cleanCandidates.length - 1);
  return cleanCandidates[randomCandidateIndex];
}

// From Mozilla MDN
// Returns a random integer between min (included) and max (included)
// Using Math.round() will give you a non-uniform distribution!
function getRandomIntInclusive(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

let grid1 = [
  [0, 0, 0, 0],
  [0, 0, 1, 0],
  [0, 1, 0, 0],
  [1, 0, 0, 0],
];

let grid2 = [
  [0, 1, 0, 0],
  [1, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
];

let grid3 = [
  [0, 0, 0, 1],
  [0, 0, 1, 0],
  [0, 1, 0, 0],
  [1, 0, 0, 0],
];


moveRobot(grid1, {row: 1, column: 1}, {row: 3, column: 3});

moveRobot(grid2, {row: 0, column: 0}, {row: 3, column: 3});

// Infinite loop
// moveRobot(grid3, {row: 0, column: 0}, {row: 3, column: 3});