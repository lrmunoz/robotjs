function Node(grid, breadcrumb, point, previousNode) {
  this.grid = grid;
  this.breadcrumb = breadcrumb;
  this.point = point;
  this.previousNode = previousNode;
  this.nextNodes = null;
}

Node.prototype.nextNode = function() {
  // Function to return an array of potential next nodes
  // It filters invalid points (obstacles or off-bounds)
  // Checks if we have a Node in the breadcrumb already for each next node found
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
    // Initialize possible next nodes
    let previousPoint = this.previousNode ? this.previousNode.point : null;
    this.nextNodes = validCandidates(this,
      [getLeftPoint(this.grid, this.point, previousPoint),
        getRightPoint(this.grid, this.point, previousPoint),
        getUpPoint(this.grid, this.point, previousPoint),
        getDownPoint(this.grid, this.point, previousPoint)]);
  }

  var nextNode = null;
  // If there are available next nodes, just remove the first one and return it
  if (this.nextNodes.length > 0) nextNode = this.nextNodes.splice(0, 1)[0];
  return nextNode;
};

Node.prototype.climb = function() {
  let path = [this.point];
  if (!this.previousNode) return path;
  let climbPath = this.previousNode.climb();
  return path.concat(climbPath);
}

function moveRobot(grid, start, exit, visitorFunc) {
  if (getIsOutside(grid, start) || getIsObstacle(grid, start)) {
    return null;
  }

  if (getIsOutside(grid, exit) || getIsObstacle(grid, exit)) {
    return null;
  }

  var moves = 0;
  var breadcrumb = initBreadcrumb(grid);
  var currentNode = new Node(grid, breadcrumb, start, null);
  breadcrumb[start.row][start.column] = currentNode;
  while (true) {
    visitorFunc(currentNode.point, currentNode.previousNode ? currentNode.previousNode.point : null);
    if (comparePoints(currentNode.point, exit)) {
      return currentNode.climb();
    }
    var nextNode = currentNode.nextNode();
    if (nextNode) {
      currentNode = nextNode;
    } else {
      if (!currentNode.previousNode) {
        return null;
      }
      currentNode = currentNode.previousNode;
    }
    moves += 1;
  }
}

function initBreadcrumb(grid) {
  let breadcrumb = [];
  grid.forEach(function() { breadcrumb.push([]); });
  return breadcrumb;
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
  let newPoint = {row: point.row + offset.offsetRow, column: point.column + offset.offsetColumn};
  if (getIsOutside(grid, newPoint)) return null;
  if (getIsObstacle(grid, newPoint)) return null;
  if (comparePoints(newPoint, previousPoint)) return null;
  return newPoint;
}

function getIsOutside(grid, point) {
  if (point.row < 0 || point.row > grid.length - 1) return true;
  if (point.column < 0 || point.column > grid[0].length - 1) return true;
  return false;
}

function getIsObstacle(grid, point) {
  return grid[point.row][point.column] === 1;
}

function comparePoints(p1, p2) {
  if (!p1 || !p2) return false;
  if (p1.row === p2.row && p1.column === p2.column) return true
  return false
}