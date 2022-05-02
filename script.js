var Nx = 301;
var Nt = 100000;
var x = makeArr(0, 1, Nx);
var dx = 1/(Nx-1);
var dt=1e-7;
var sinusni = false;



function nalozi() {
    document.getElementById("Nx").value = Nx;
    document.getElementById("Nt").value = Nt;

    racunaj();
   
}

function zamenjajPsi(){
    if (sinusni)
        sinusni = false;
    else sinusni = true;
    racunaj()
}

function narisiGrafPsi(psi) {
    var grafPsi = [];
    for (var i = 0; i < psi.length; i++) {
        var tocka = {x: x[i], y: psi[i], label: x[i]}
        grafPsi[i] = tocka;
    }


    var chart = new CanvasJS.Chart("chartContainer", {
        animationEnabled: true,  
        title:{
            text: "Zacetna valovna funkcija: psi0"
        },
        axisX: {
            minimum: 0,
            maximum: 1,
        },
        data: [{
            yValueFormatString: "#,###",
            xValueFormatString: "#,###",
            type: "spline",
            dataPoints: grafPsi
        }]
    });
    chart.render();
}

function integral(psi) {
    var vsota = 0
    for (var i = 0; i < Nx; i++) {
        vsota += psi[i] * psi[i] * dx;
    }
    return vsota;
}

function sestaviPsi(){
    var psi0 = [];
    if(sinusni) {
        for(var i = 0; i < Nx; i++) {
            psi0[i] = Math.sqrt(2)*Math.sin(Math.PI*x[i]);
        }
    } else {
        for(var i = 0; i < Nx; i++) {
            psi0[i] = Math.random();
        }
        var normalizacija = integral(psi0);
        for(var i = 0; i < Nx; i++) {
            psi0[i] = Math.sqrt((psi0[i] * psi0[i]) / normalizacija);
        }
    }
    narisiGrafPsi(psi0);
    return psi0;

}

function posodobiParametre() {
    Nx = document.getElementById("Nx").value;
    Nt = document.getElementById("Nt").value;
    x = makeArr(0, 1, Nx);
    dx = 1/(Nx-1);
    dt=1e-7;
}

function racunaj() {
    posodobiParametre()
    var psi0 = sestaviPsi();
    var psi = [Nt][Nx];
}

function makeArr(startValue, stopValue, cardinality) {
    var arr = [];
    var step = (stopValue - startValue) / (cardinality - 1);
    for (var i = 0; i < cardinality; i++) {
      arr.push(startValue + (step * i));
    }
    return arr;
  }