var Nx = 100;
var Nt = 1000;
var x = makeArr(0, 1, Nx);
var dx = 1/(Nx-1);
var dt=1 / Nt;
var sinusni = false;
var psi0 = [];
var stevec = 0;

const psi = new Array(Nt);
for (var r = 0; r < Nt; r++) {
    psi[r] = new Array(Nx);
    psi[r][0] = {re: 0, im: 0};
}

function nalozi() {
    document.getElementById("Nx").value = Nx;
    document.getElementById("Nt").value = Nt;
    psi0 = sestaviPsi();
}

function nakljucniPsi(){
    sinusni = false;
    psi0 = sestaviPsi();
}

function sinusniPsi(){
    sinusni = true;
    psi0 = sestaviPsi();
}

function narisiGrafPsi(func) {
    var grafPsi = [];
    for (var i = 0; i < func.length; i++) {
        var tocka = {x: x[i], y: func[i], label: x[i]}
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

function integral(func) {
    var vsota = 0
    for (var i = 0; i < Nx; i++) {
        vsota += func[i] * func[i] * dx;
    }
    return vsota;
}

function sestaviPsi(){
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
    
    var psiComplex = [];

    for (var k = 0; k < Nx; k++) {
        psiComplex[k] = {re: psi0[k], im: 0};
    }
    psi[0] = psiComplex;

    for(var t = 0; t < Nt - 1; t++) {
        psi[t][Nx] = {re: 0, im: 0};
        for(var i = 1; i < Nx; i++) {
            psi[t + 1][i] = {re: psi[t][i].re + (-1 * (dt / 2 * dx * dx) * (psi[t][i + 1].im - 2 * psi[t][i].im + psi[t][i - 1].im)), im: psi[t][i].im + (psi[t][i + 1].re - 2 * psi[t][i].re + psi[t][i - 1].re) * (dt / 2 * dx * dx)};  
        }
        var normalizacija = integral(psi[t + 1]);
        for (var j = 1; j < Nx; j++) {
            psi[t + 1][j].re = psi[t + 1][j].re / normalizacija;
            psi[t + 1][j].im = psi[t + 1][j].im / normalizacija;
            psi[t + 1][i].y = psi[t + 1][i].re;
            psi[t + 1][i].x = x[i];
        }
    }

    console.log(psi)

    animacijaGraf();
    document.getElementById("next").hidden = false;
}

function animacijaGraf() {
    var chart = new CanvasJS.Chart("chartContainer2", {
        animationEnabled: false,  
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
            dataPoints: psi[stevec]
        }]
    });
    chart.render();
}

function next() {
    stevec++;
    stevec = stevec % Nt;
    animacijaGraf();
}


function makeArr(startValue, stopValue, cardinality) {
    var arr = [];
    var step = (stopValue - startValue) / (cardinality - 1);
    for (var i = 0; i < cardinality; i++) {
      arr.push(startValue + (step * i));
    }
    return arr;
  }