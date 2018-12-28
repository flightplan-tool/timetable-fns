var moment = require('moment-timezone')

var reDate = /^(\d{4})-(\d{2})-(\d{2})$/
var reTime = /^(\d{2}):(\d{2})$/

var INVALID = 'Invalid'

function _g (str) {
  var arr = _parse(str)
  if (!arr || arr.includes(NaN)) {
    return NaN
  }
  var y = arr[0]
  var m = arr[1]
  var d = arr[2]
  m = (m + 9) % 12
  y = y - Math.floor(m / 10)
  return 365 * y +
    Math.floor(y / 4) -
    Math.floor(y / 100) +
    Math.floor(y / 400) +
    Math.floor((m * 306 + 5) / 10) +
    (d - 1)
}

function _d (g) {
  if (Number.isNaN(g)) {
    return INVALID
  }
  var y = Math.floor((10000 * g + 14780) / 3652425)
  var ddd = g - (365 * y +
    Math.floor(y / 4) -
    Math.floor(y / 100) +
    Math.floor(y / 400))
  if (ddd < 0) {
    y = y - 1
    ddd = g - (365 * y +
      Math.floor(y / 4) -
      Math.floor(y / 100) +
      Math.floor(y / 400))
  }
  var mi = Math.floor((100 * ddd + 52) / 3060)
  var mm = (mi + 2) % 12 + 1
  y = y + Math.floor((mi + 2) / 12)
  var dd = ddd - Math.floor((mi * 306 + 5) / 10) + 1
  return _str(y, mm, dd)
}

function _parse (str) {
  if (str && typeof str === 'string') {
    var r = reDate.exec(str)
    if (r) {
      return [ parseInt(r[1]), parseInt(r[2]), parseInt(r[3]) ]
    }
  }
  return null
}

function _str (y, m, d) {
  return y.toString().padStart(4, '0') + '-' +
    m.toString().padStart(2, '0') + '-' +
    d.toString().padStart(2, '0')
}

function coerce (dt) {
  return moment.isMoment(dt) ? dt.format('YYYY-MM-DD') : dt
}

function coerceTime (dt) {
  return moment.isMoment(dt) ? dt.format('HH:mm') : dt
}

function format (dt) {
  return moment(dt, 'YYYY-MM-DD', true).format('L')
}

function diff (a, b) {
  return _g(b) - _g(a)
}

function plus (dt, days) {
  return _d(_g(dt) + days)
}

function minus (dt, days) {
  return _d(_g(dt) - days)
}

function today () {
  var m = moment()
  return _str(m.year(), m.month() + 1, m.date())
}

function valid (dt) {
  return dt !== INVALID && dt === _d(_g(dt))
}

function validTime (dt) {
  if (dt && typeof dt === 'string') {
    var r = reTime.exec(dt)
    if (r) {
      var h = parseInt(r[1])
      var m = parseInt(r[2])
      return h >= 0 && h <= 23 && m >= 0 && m <= 59
    }
  }
  return false
}

module.exports = {
  coerce,
  coerceTime,
  format,
  diff,
  plus,
  minus,
  today,
  valid,
  validTime
}
