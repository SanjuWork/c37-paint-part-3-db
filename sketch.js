// Declaring different variables
var drawing = [];
var currentPath = [];
var database;
var isDrawing = false;
var h = 0, u = 0; e = 0;
var r = 255;
var g = 255;
var b = 255;
var input, inputv;



// Calling the function setup
function setup() {

  // Creating the canvas
  var canvas = createCanvas(800, 500);

  // Starting the drawing
  canvas.mousePressed(startPath);
  canvas.parent('canvascontainer');

  // Ending the drawing
  canvas.mouseReleased(endPath);

  // Adding database
  database = firebase.database();

  // Getting the url's parameters
  var params = getURLParams();

  if(params.id) {
    showDrawing(params.id);
  }

  // Creating a save Button
  var saveButton = select('#saveButton');

  // Saving the drawing when the button is pressed
  saveButton.mousePressed(saveDrawing);

  // Creating a clear button
  var clearButton = select('#clearButton');

  // Clearing the drawing when the button is pressed
  clearButton.mousePressed(clearDrawing);

  namee = select('#Name');
  namee.position(110,517);

  input = select('#nameInput');
  input.position(150,517);

  // Creating a reference to the database
  var ref = database.ref('Drawings');
  ref.on("value", gotData, errData);
}



// Calling the main part of the code
function draw() {
  
  // Colouring the background
  background(r,g,b);

  // Changing the value of Red based on the mouse movement about the X ang Y axis
  r = map(mouseX,0,1366,0,255);
  r = map(mouseY,0,625,0,255);

  // Changing the value of Green based on the mouse movement about the X and Y axis
  g = map(mouseX,0,1366,0,255);
  g = map(mouseY,0,625,0,255);
  
  // Changing the value of Blue based on the mouse movement about the X axis
  b = map(mouseX,0,1366,0,255);

  // Adding the point to current path if the isDrawing is true
  if(isDrawing === true) {
    var point = {
      x: mouseX,
      y: mouseY
    }
    currentPath.push(point);
  }

  // Changing the stroke and stroke Weight according to the keys pressed
  if(keyCode === 82) {
    stroke("red");
    strokeWeight(6);
  }else if(keyCode === 71) {
    stroke("green");
    strokeWeight(8);
  }else if(keyCode === 89) {
    stroke("yellow");
    strokeWeight(10);
  }else if(keyCode === 66) {
    stroke("blue");
    strokeWeight(4);
  }else if(keyCode === 87) {
    stroke("white");
    strokeWeight(6);
  }else if(keyCode === 79) {
    stroke("orange");
    strokeWeight(8);
  }else if(keyCode === 85) {
    stroke("purple");
    strokeWeight(10);
  }else if(keyCode === 80) {
    stroke("pink");
    strokeWeight(8);
  }else if(keyCode === 76) {
    stroke("black");
    strokeWeight(7);
  }
  
  // Displaying the drawing
  for(var i = 0; i < drawing.length; i++) {
    var path = drawing[i];
    beginShape();
    noFill();
    for(var j = 0; j < path.length; j++) {
      vertex(path[j].x,path[j].y);
    }
    endShape();
  }
}




// Starting the drawing
function startPath() {
  isDrawing = true;
  currentPath = [];
  drawing.push(currentPath);
}



// Ending the drawing
function endPath() {
  isDrawing = false;
}



// Saving the drawing
function saveDrawing() {
  var ref = database.ref('Drawings');

  inputv = input.value();

  var data = {
    drawing: drawing,
    name: inputv
  };

  // Pushing the data to the database
  ref.push(data);
}



// Retrieving the data back
function gotData(data) {

  // Clearing the previous list
  var elts = selectAll('.listing');
  for(var i = 0; i < elts.length; i++) {
    elts[i].remove();
  }

  var drawings = data.val();
  var keys = Object.keys(drawings);

  // Displaing the keys' key
  for (var i = 0; i < keys.length; i++) {
    var key = keys[i];
    
    var li = createElement('li');
    li.class('listing');
    var ahref = createA('?id=' + key, key);
    ahref.mousePressed(showDrawing);
    ahref.parent(li);

    li.parent('drawinglist');
  }
}



// Consoling the error if there is any
function errData(err) {
  console.log(err);
}



// Showing the drawing if the link is clicked 
function showDrawing(key) {
  if(key instanceof MouseEvent) {
    key = this.html();
  }

  var ref = database.ref('Drawings/' + key);
  ref.once("value", oneDrawing, errData);

  function oneDrawing(data) {
    var dbdrawing = data.val();
    drawing = dbdrawing.drawing;
  }
}



// Clearing the drawing if the clear Button is pressed
function clearDrawing() {
  drawing = [];
}