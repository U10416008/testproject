function showVal(newVal) {
    document.getElementById("eta").innerHTML = newVal;
    reset(1);
}

function showVal1(newVal) {
    document.getElementById("eta1").innerHTML = newVal;
    reset(0);
}
let MSE = 1;
let LOG = 0;
var next = 0;
var next_log = 0;
var init_x = -5;
var init_x_log = -5;
var learning_rate = 0.01;
var chart;
var chart_log;

var data;
var data_log;
var data_gen;
var x = [
    ['x', 'y', { 'type': 'string', 'role': 'style' }]
];
for (i = 0; i < 1000; i++) {
    x.push([(i - 500) / 100, square((i - 500) / 100), null]);
}
var x_log = [
    ['x', 'y', { 'type': 'string', 'role': 'style' }]
];
for (i = 0; i < 1000; i++) {
    x_log.push([(i - 500) / 100, logistic((i - 500) / 100), null]);
}


var options = {
    title: 'Mean Square Error',
    curveType: 'function',
    legend: { position: 'bottom' },
    'width': 640,
    'height': 480,
    pointSize: 2
};
var options_log = {
    title: 'Log Error',
    curveType: 'function',
    legend: { position: 'bottom' },
    'width': 640,
    'height': 480,
    pointSize: 2
};

function step(type) {

    if (type == MSE) {
        document.getElementById("iter").innerHTML = ++next;
        init_x -= learning_rate * derivative_square(init_x);
        var update_x = Math.round(init_x * 100) + 500;
        document.getElementById("num").innerHTML = "(" + Math.round(init_x * 100) / 100 + "," + Math.round(square(init_x) * 100) / 100 + ")";
        data.setCell(update_x, 2, 'point { size: 12; shape-type: square; fill-color: #a52714; }');
        chart.draw(data, options);
    } else {
        document.getElementById("iter1").innerHTML = ++next_log;
        init_x_log -= learning_rate * derivative_logistic(init_x_log);
        var update_x = Math.round(init_x_log * 100) + 500;
        document.getElementById("num1").innerHTML = "(" + Math.round(init_x_log * 100) / 100 + "," + Math.round(logistic(init_x_log) * 100) / 100 + ")";
        data_log.setCell(update_x, 2, 'point { size: 12; shape-type: square; fill-color: #a52714; }');
        chart_log.draw(data_log, options_log);
    }

}

function reset(type) {


    if (type == MSE) {
        next = 0;
        document.getElementById("iter").innerHTML = next;
        learning_rate = parseFloat(document.getElementById("eta").innerHTML);
        if (learning_rate == null) {
            learning_rate = 0.01;
        }
        document.getElementById("num").innerHTML = 0;
        init_x = -5;
        data = google.visualization.arrayToDataTable(x);
        chart.draw(data, options);
    } else {
        next_log = 0;
        document.getElementById("iter1").innerHTML = next_log;
        learning_rate = parseFloat(document.getElementById("eta1").innerHTML);
        if (learning_rate == null) {
            learning_rate = 0.01;
        }
        document.getElementById("num1").innerHTML = 0;
        init_x_log = -5;
        data_log = google.visualization.arrayToDataTable(x_log);
        chart_log.draw(data_log, options_log)
    }
}

function derivative_square(x) {
    return 2 * (x - 1);
}

function square(x) {
    return (x - 1) * (x - 1);
}


function drawChart() {

    var i;
    data = google.visualization.arrayToDataTable(x);
    chart = new google.visualization.LineChart(document.getElementById('piechart'));

    chart.draw(data, options);

    data_log = google.visualization.arrayToDataTable(x_log);
    chart_log = new google.visualization.LineChart(document.getElementById('log'))
    chart_log.draw(data_log, options_log);

    data_gen = google.visualization.arrayToDataTable([
        ['X', 'YB', 'YR', 'Line'],
        [0, null, null, 0],
        [2, 3, null, null],
        [4, null, 2, null],
        [5, 6, null, null],
        [7, null, 4, null],
        [9, 10, null, null],
        [15, null, null, 15],

    ]);
    var options_gen = {
        title: 'X , Y',
        hAxis: { title: 'X', minValue: 0, maxValue: 15 },
        vAxis: { title: 'Y', minValue: 0, maxValue: 15 },
        legend: 'none',
        interpolateNulls: true,
        curveType: 'function',
        series: {
            0: {

                color: 'blue',
                visibleInLegend: false

            },
            1: {

                color: 'red',
                visibleInLegend: false

            },
            2: { lineWidth: 1, pointSize: 0 }
        },
        'width': 640,
        'height': 480,

    };
    var chart_gen = new google.visualization.ScatterChart(document.getElementById('gen_graph'));

    chart_gen.draw(data_gen, options_gen);
}

function derivative_logistic(x) {
    return -Math.exp(-x) / (1 + Math.exp(-x));
}

function logistic(x) {
    return Math.log(1 + Math.exp(-x));
}