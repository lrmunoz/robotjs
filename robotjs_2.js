function Node(grid, breadcrumb, point, previousNode) {
  this.grid = grid;
  this.breadcrumb = breadcrumb;
  this.point = point;
  this.previousNode = previousNode;
  this.nextNodes = null;
}

Node.prototype.nextNode = function() {
  // Return an array of potential next nodes
  var validCandidates = function(_this, candidatePoints) {
    let validCandidates = candidatePoints.filter(
      function(candidate) { return candidate !== null; }).map(
      function(point) {
        if (_this.breadcrumb[point.row][point.column]) {
          return _this.breadcrumb[point.row][point.column];
        } else {
          let newNode = new Node(_this.grid, _this.breadcrumb, point, _this);
          _this.breadcrumb[point.row][point.column] = newNode;
          return newNode;
        }
      });
    return validCandidates;
  };

  if (!this.nextNodes) {
    let previousPoint = this.previousNode ? this.previousNode.point : null;
    this.nextNodes = validCandidates(this,
      [getLeftPoint(this.grid, this.point, previousPoint),
        getRightPoint(this.grid, this.point, previousPoint),
        getUpPoint(this.grid, this.point, previousPoint),
        getDownPoint(this.grid, this.point, previousPoint)]);
  }

  var nextNode = null;
  if (this.nextNodes.length > 0) nextNode = this.nextNodes.splice(0, 1)[0];
  return nextNode;
};

function moveRobot(grid, start, exit) {
  var moves = 0;
  var breadcrumb = [];
  grid.forEach(function() { breadcrumb.push([]); });
  var currentNode = new Node(grid, breadcrumb, start, null);
  breadcrumb[start.row][start.column] = currentNode;
  while (true) {
    // console.log(`row: ${currentNode.point.row}, column: ${currentNode.point.column}`);
    if (comparePoints(currentNode.point, exit)) {
      console.log(`Arrived! (moves: ${moves})`);
      return;
    }
    var nextNode = currentNode.nextNode();
    if (nextNode) {
      currentNode = nextNode;
    } else {
      if (!currentNode.previousNode) {
        console.log(`I can't get there! (moves: ${moves})`);
        return;
      }
      currentNode = currentNode.previousNode;
    }
    moves += 1;
  }
}

function getLeftPoint(grid, point, previousPoint) {
  return offsetPoint(grid, point, {offsetRow: 0, offsetColumn: -1}, previousPoint)
}

function getRightPoint(grid, point, previousPoint) {
  return offsetPoint(grid, point, {offsetRow: 0, offsetColumn: 1}, previousPoint)
}

function getUpPoint(grid, point, previousPoint) {
  return offsetPoint(grid, point, {offsetRow: -1, offsetColumn: 0}, previousPoint)
}

function getDownPoint(grid, point, previousPoint) {
  return offsetPoint(grid, point, {offsetRow: 1, offsetColumn: 0}, previousPoint)
}

function offsetPoint(grid, point, offset, previousPoint) {
  let newRow = point.row + offset.offsetRow;
  let newColumn = point.column + offset.offsetColumn;
  if (newRow < 0 || newRow > grid.length - 1) return null;
  if (newColumn < 0 || newColumn > grid[0].length - 1) return null;
  let newPoint = {row: newRow, column: newColumn};
  if (getIsObstacle(grid, newPoint)) return null;
  if (comparePoints(newPoint, previousPoint)) return null;
  return newPoint;
}

function getIsObstacle(grid, point) {
  return grid[point.row][point.column] === 1;
}

function comparePoints(p1, p2) {
  if (!p1 || !p2) return false;
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

let grid4 = [
  [0, 0, 0],
  [0, 1, 1],
  [0, 0, 0],
];

let grid5 = [
  [0, 0, 1],
  [0, 1, 0],
  [1, 0, 0],
];

moveRobot(grid1, {row: 1, column: 1}, {row: 3, column: 3});
moveRobot(grid2, {row: 0, column: 0}, {row: 3, column: 3});
moveRobot(grid3, {row: 0, column: 0}, {row: 3, column: 3});
moveRobot(grid4, {row: 0, column: 0}, {row: 2, column: 2});
moveRobot(grid5, {row: 0, column: 0}, {row: 2, column: 2});