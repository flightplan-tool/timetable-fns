Handy library of utility functions for working with timetables (such as flight or train schedules).

## Installation

`npm install timetable-fns --save` or `yarn add timetable-fns`

## Usage

```javascript
const timetable = require('timetable-fns')

// Simple difference in calendar dates
timetable.diff('2018-12-25', '2019-01-05')
// ==> 11

// Can also be negative
timetable.diff('2019-01-05', '2018-12-25')
// ==> -11
```

Dates must be provided in `YYYY-MM-DD` format, no other formats are provided. A `coerce` function is provided, which accepts either a `String` or `moment` object, and converts to the proper format.

```javascript
a = timetable.coerce(moment('Mar 5', 'MMM D'))
b = timetable.coerce(moment('Mar 8', 'MMM D'))
timetable.diff(a, b)
```

Historical dates are handled correctly, back to the year 0, although using Gregorian rules (the Gregorian calendar was not established until October 1582).

```javascript
// Handles historical dates correctly
moment('1883-11-18').diff(moment('1883-11-20'), 'days')
// => -1 (moment.js gives unexpected result)
> timetable.diff('1883-11-20', '1883-11-18')
// => -2 (what most people would expect)

// Supports dates back to establishment of Gregorian calendar
timetable.diff('1582-10-01', '2000-01-01')
// => 152398
```

You can also do simple math, or obtain the day numbers and operate on those directly.

```javascript
// Simple date math
timetable.plus('2017-05-15', 3)
// => '2017-05-18'
timetable.minus('2017-05-15', 3)
// ==> '2017-05-12'

// You can also do your own date math directly
const dn = timetable.dayNumber('2000-01-01')
[ 1, 2, 3 ].map(x => timetable.calendarDate(dn + x))
// => [ '2000-01-02', '2000-01-03', '2000-01-04' ]
```

### Performance

A benchmark is included, which compares timetable to [moment.js](https://momentjs.com) for computing the difference between two dates. On a 2.9 Ghz i7 running node 11.6.0, this yields:

```
benchmarking diff performance ...

timetable x 1,334,060 ops/sec ±1.23% (88 runs sampled)
moment x 61,841 ops/sec ±0.57% (95 runs sampled)
moment (reuse) x 591,905 ops/sec ±1.90% (86 runs sampled)
date-fns x 375,733 ops/sec ±0.60% (92 runs sampled)

              timetable was fastest
         moment (reuse) was 55.9% ops/sec slower (factor 2.3)
               date-fns was 71.7% ops/sec slower (factor 3.5)
                 moment was 95.3% ops/sec slower (factor 21.4)
```

Even when reusing the same moment objects (whereas `timetable` is re-parsing the provided dates every time), `moment.js` is still 2.5x slower. Of course, `moment.js` is doing a lot more work, because it supports time, but if you need to only perform date calculations `timetable` is a much faster choice.

You can also run the benchmark yourself, with: `yarn bench` (or `npm run bench`).

### How does it work?

All date operations are based on the concept of an integer day number, similar to the concept of the [Julian Day Number](https://en.wikipedia.org/wiki/Julian_day). The algorithms to compute a Gregorian-based day number (and back) are from:

https://alcor.concordia.ca/~gpkatch/gdate-algorithm.html
[Archived Version](https://web.archive.org/web/20170507133619/https://alcor.concordia.ca/~gpkatch/gdate-algorithm.html)
