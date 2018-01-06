let brain = require('brain.js');
let Papa = require('papaparse');
let fs = require('fs');
let net = new brain.NeuralNetwork();

function readData(cb) {
    let file = fs.readFileSync('../train.csv', 'utf8');
    let data = Papa.parse(file, {
        complete: function(results) {
            console.log('train.csv is readed');
            cb(results.data.splice(1));
        }
    });
}

function train(trainingData) {
    // let data = trainingData.filter(d => d.output[0] === 0 || d.output[0] === 1);
    // let rData = intermingleData(data);

    // // let rData = data.slice(0).sort(compareRandom);

    // console.log('Training start');

    // net.train(rData, {log: true});

    // let wstream = fs.createWriteStream('net.json');
    // wstream.write(JSON.stringify(net.toJSON()));
    // wstream.end();

    net.fromJSON(require('./net.json'));

    test();
}

function compareRandom(a, b) {
    return Math.random() - 0.5;
  }

function test() {
    let testFile = fs.readFileSync('../__test.csv', 'utf8');
    let testData = Papa.parse(testFile, {
        complete: function(results) {
            console.log('Test start');

            let rows = results.data;
            let resultData = [
                ['id', 'prob']
            ];

            for (let i = 1; i < rows.length - 1; i++) {
                let row = rows[i].splice(1);
                let r = net.run(row.map(s => Number(s)));

                // console.log(r[0]);
                resultData.push([i, ...r]);
            }

            saveResult(resultData);
        }
    });
}

function saveResult(data) {
    var csv = Papa.unparse(data);

    fs.writeFileSync('../result-js.csv', csv);
    // console.log(csv);
}

function start() {
    readData(r => {
        train(r.map(d => {
            return {
                input: d.splice(1, 5).map(s => Number(s)),
                output: [Number(d[1])]
            };
        }));
    });

    // train();
}

function intermingleData(data) {
    let result = [];

    for (let i = 0, k = data.length - 1; i < data.length / 2; i++, k--) {
        result.push(data[i]);
        result.push(data[k]);
    }

    let end = result.splice(result.length - 80000);

    for (let i = 0; i < end.length; i++) {
        result.splice((i * 9 + 1), 0, end[i]);
    }

    return result;
}

start();
