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

function nakljucniPsi(){
    sinusni = false;
    racunaj()
}

function sinusniPsi(){
    sinusni = true;
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
        for(var j = 0;j < Nx;j++) {
            psi0[j] = Math.random();
        }
        var normalizacija = integral(psi0);
        for(var k = 0; k < Nx; k++) {
            psi0[k] = Math.sqrt((psi0[k] * psi0[k]) / normalizacija);
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
    const psi = new Array(Nt);
    for (var i = 0; i < Nt; i++) {
        psi[i] = new Array(Nx);
    }

    var psiComplex = [];

    for (var j = 0; j < Nx; j++) {
        psiComplex[j] = math.complex(psi0[j], 0);
    }
    psi[0] = psiComplex;

    console.log(psi[0][1]);

    for(var t = 0; t < Nt - 1; t++) {
        for(var i = 1; i < Nx - 1; i++) {
            psi[t + 1][i] = math.add(psi[t][i], math.multiply(math.multiply(math.complex(0, 1/2), dt/(dx * dx)), math.add(math.add(psi[t][i - 1], math.multiply(-1, math.multiply(2, psi[t][i]))), psi[t][i-1])));
            
        }
    }

    console.log(psi);
}

function makeArr(startValue, stopValue, cardinality) {
    var arr = [];
    var step = (stopValue - startValue) / (cardinality - 1);
    for (var i = 0; i < cardinality; i++) {
      arr.push(startValue + (step * i));
    }
    return arr;
  }