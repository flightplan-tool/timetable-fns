const benchmark = require('benchmark')
const chalk = require('chalk')
const dateFns = require('date-fns')
const moment = require('moment')
const timetable = require('./index')

var padSize = 23

function newSuite (name) {
  var benches = []
  return new benchmark.Suite(name)
    .on('add', function (event) {
      benches.push(event.target)
    })
    .on('start', function () {
      process.stdout.write(chalk.white.bold('benchmarking ' + name + ' performance ...') + '\n\n')
    })
    .on('cycle', function (event) {
      process.stdout.write(String(event.target) + '\n')
    })
    .on('complete', function () {
      if (benches.length > 1) {
        benches.sort(function (a, b) { return getHz(b) - getHz(a) })
        const fastest = benches[0]
        const fastestHz = getHz(fastest)
        process.stdout.write('\n' + chalk.white(pad(fastest.name, padSize)) + ' was ' + chalk.green('fastest') + '\n')
        benches.slice(1).forEach(function (bench) {
          const hz = getHz(bench)
          const percent = 1 - hz / fastestHz
          process.stdout.write(chalk.white(pad(bench.name, padSize)) + ' was ' + chalk.red((percent * 100).toFixed(1) + '% ops/sec slower (factor ' + (fastestHz / hz).toFixed(1) + ')') + '\n')
        })
      }
      process.stdout.write('\n')
    })
}

function getHz (bench) {
  return 1 / (bench.stats.mean + bench.stats.moe)
}

function pad (str, len, l) {
  while (str.length < len) { str = l ? str + ' ' : ' ' + str }
  return str
}

const moment1 = moment('2019-08-17')
const moment2 = moment('1912-03-14')

newSuite('diff')
  .add('timetable', function () {
    timetable.diff('1912-03-14', '2019-08-17')
  })
  .add('moment', function () {
    moment('2019-08-17').diff(moment('1912-03-14'), 'days')
  })
  .add('moment (reuse)', function () {
    moment1.diff(moment2, 'days')
  })
  .add('date-fns', function () {
    dateFns.differenceInCalendarDays(new Date(2019, 8, 17), new Date(1912, 3, 14))
  })
  .run()
