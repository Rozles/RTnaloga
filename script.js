var Nx = 301;
var Nt = 100000;


function nalozi() {
    document.getElementById("Nx").value = Nx;
    document.getElementById("Nx").value = Nx;
}

function makeArr(startValue, stopValue, cardinality) {
    var arr = [];
    var step = (stopValue - startValue) / (cardinality - 1);
    for (var i = 0; i < cardinality; i++) {
      arr.push(startValue + (step * i));
    }
    return arr;
  }