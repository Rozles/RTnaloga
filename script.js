var Nx = 201;
var Nt = 10000;
var x = makeArr(0, 1, Nx);
var dx = 1/(Nx-1);
var dt= 1 / Nt;
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
    posodobiParametre();
    sinusni = false;
    psi0 = sestaviPsi();
    document.getElementById("reset").hidden = true;
    document.getElementById("back100").hidden = true;
    document.getElementById("back10").hidden = true;
    document.getElementById("back").hidden = true;
    document.getElementById("next").hidden = true;
    document.getElementById("next10").hidden = true;
    document.getElementById("next100").hidden = true;
    document.getElementById("next1000").hidden = true;
}

function sinusniPsi(){
    posodobiParametre();
    sinusni = true;
    psi0 = sestaviPsi();
    document.getElementById("reset").hidden = true;
    document.getElementById("back100").hidden = true;
    document.getElementById("back10").hidden = true;
    document.getElementById("back").hidden = true;
    document.getElementById("next").hidden = true;
    document.getElementById("next10").hidden = true;
    document.getElementById("next100").hidden = true;
    document.getElementById("next1000").hidden = true;
}

function narisiGrafPsi(func) {
    var chart = new CanvasJS.Chart("chartContainer", {
        animationEnabled: true,  
        title:{
            text: "valovna funkcija psi"
        },
        axisX: {
            minimum: 0,
            maximum: 1,
        },
        axisY: {
            minimum: -0.5,
            maximum: 4,
            title: "|\psi(x)ˆ2|",
        },
        data: [{
            yValueFormatString: "#,###",
            xValueFormatString: "#,###",
            type: "spline",
            dataPoints: func
        }]
    });
    chart.render();
}

function integral(func) {
    var vsota = 0;
    for (var i = 0; i < Nx; i++) {
        vsota += func[i] * func[i] * dx;
    }
    return vsota;
}

function integralComplex(func) {
    var vsota = new Complex(0, 0);
    for (var i = 0; i < Nx; i++) {
        var a = new Complex(func[i]);
        vsota = vsota.add(a.mul(a).mul(new Complex(dx, 0)));
        
    }
    return vsota;
}

function sestaviPsi(){
    if(sinusni) {
        for(var i = 0; i < Nx; i++) {
            psi0[i] = new Complex(Math.sqrt(2)*Math.sin(Math.PI*x[i]));
            psi0[i].y = psi0[i].re * psi0[i].re;
            psi0[i].x = x[i];
        }
    } else {
        for(var j = 0;j < Nx;j++) {
            psi0[j] = Math.random();
        }
        var normalizacija = integral(psi0);
        for(var k = 0; k < Nx; k++) {
            psi0[k] = new Complex(Math.sqrt((psi0[k] * psi0[k]) / normalizacija));
            psi0[k].y = psi0[k].re * psi0[k].re;
            psi0[k].x = x[k];
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
    dt= 1 / Nt;
}

function racunaj() {
    posodobiParametre()
    
    psi[0] = psi0;

    /*for(var t = 0; t < Nt - 1; t++) {
        psi[t][Nx] = {re: 0, im: 0};
        for(var i = 1; i < Nx; i++) {
            psi[t + 1][i] = {re: psi[t][i].re + (-1 * (dt / 2 * dx * dx) * (psi[t][i + 1].im - 2 * psi[t][i].im + psi[t][i - 1].im)), im: psi[t][i].im + (psi[t][i + 1].re - 2 * psi[t][i].re + psi[t][i - 1].re) * (dt / 2 * dx * dx)};  
        }
        var n = integralComplex(psi[t + 1]);
        for (var j = 1; j < Nx; j++) {
            var a = psi[t + 1][j];
            psi[t + 1][j] = {re: (a.re * n.re + a.im * n.im) / (n.re * n.re + n.im * n.im), im: (a.im * n.re - a.re * n.im) / (n.re * n.re + n.im * n.im)};
            psi[t + 1][j].y = psi[t + 1][j].re;
            psi[t + 1][j].x = x[j];
        }
    }*/

    for(var t = 0; t < Nt - 1; t++) {
        psi[t][Nx] = new Complex(0, 0);
        for(var i = 1; i < Nx; i++) {
            psi[t + 1][i] = psi[t][i].add(new Complex(0, 1/2).mul(new Complex(dt/(dx * dx))).mul(psi[t][i+1].sub(psi[t][i].mul(-2)).add(psi[t][i-1])));
        }
        var n = integralComplex(psi[t + 1]);
        for (var j = 1; j < Nx; j++) {
            psi[t + 1][j] = psi[t + 1][j].div(n.sqrt());
            psi[t + 1][j].y = psi[t + 1][j].re * psi[t + 1][j].re;
            psi[t + 1][j].x = x[j];
        }
    }

    animacijaGraf();
    document.getElementById("reset").hidden = false;
    document.getElementById("back100").hidden = false;
    document.getElementById("back10").hidden = false;
    document.getElementById("back").hidden = false;
    document.getElementById("next").hidden = false;
    document.getElementById("next10").hidden = false;
    document.getElementById("next100").hidden = false;
    document.getElementById("next1000").hidden = false;
}

function animacijaGraf() {
    var chart = new CanvasJS.Chart("chartContainer", {
        animationEnabled: false,  
        title:{
            text: "valovna funkcija psi | t = " + stevec 
        },
        axisX: {
            minimum: 0,
            maximum: 1,
        },
        axisY: {
            minimum: -0.5,
            maximum: 4,
            title: "|\psi(x)ˆ2|",
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

function reset() {
    stevec = 0;
    animacijaGraf();
}

function next10() {
    stevec += 10;
    stevec = stevec % Nt;
    animacijaGraf();
}

function next100() {
    stevec += 100;
    stevec = stevec % Nt;
    animacijaGraf();
}

function next1000() {
    stevec += 1000;
    stevec = stevec % Nt;
    animacijaGraf();
}

function back() {
    stevec--;
    if (stevec < 0)
        stevec = Nt -1;
    animacijaGraf();
}

function back10() {
    stevec -= 10;
    if (stevec < 0)
        stevec = Nt -1;
    animacijaGraf();
}

function back100() {
    stevec -= 100;
    if (stevec < 0)
        stevec = Nt -1;
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