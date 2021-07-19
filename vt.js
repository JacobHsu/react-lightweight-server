const express = require('express')
const cors = require('cors')
const app = express()
const router = express.Router()
const yahooFinance = require('yahoo-finance') // https://www.npmjs.com/package/yahoo-finance
const moment = require('moment')
var _ = require('lodash');

const d = new Date();
const today = d.toISOString().substring(0, 10);

let twoWeeksAgo = d.setDate(d.getDate() - 365);
twoWeeksAgo = new Date(twoWeeksAgo).toISOString().substring(0, 10);;


var historical = function (symbol, from, to, callback) {
    yahooFinance.historical(
    {
      symbol: symbol,
      from: from,
      to: to,
      // period: 'd'  // 'd' (daily), 'w' (weekly), 'm' (monthly), 'v' (dividends only)
    },
    function (err, quotes) {

      quotes.reverse(); // 重要! lightweight-charts 日期要小到大排序
      const candlestickSeries =  []
      const volumeSeries =  []
      quotes.map((obj) => {
        if(obj.date) obj.time =  moment(obj.date).format('yyyy-MM-DD') // Date.parse(obj.date)

        delete obj.symbol
        delete obj.date
        delete obj.adjClose

        if(obj.volume) obj.volumeSeries = { time: obj.time, value: obj.volume }
        candlestickSeries.push( { open: obj.open, high: obj.high, low: obj.low , close: obj.close , time: obj.time } ) 
        volumeSeries.push({ time: obj.time, value: obj.volume } )
        delete obj.volume

        return obj
      })
      
      const ret = {}
      // ret.quotes = quotes
      ret.candlestickSeries = candlestickSeries
      ret.volumeSeries = volumeSeries
      callback(null, ret)
    }
  )
}

let retJSON = {}, retVolumeSeries = {}
// 'VT' 2330.TW 2603.TW 長榮
historical('2603.TW', twoWeeksAgo, today, function(error, result) {
    retJSON = result
}) 


app.use('/api', router)

app.use(cors())

// Enable CORS for a Single Route
router.get('/vt', cors(), function (req, res) {
  res.json({
    errno: 0,
    etf: retJSON.quotes,
    candlestickSeries: retJSON.candlestickSeries,
    volumeSeries: retJSON.volumeSeries
  })
})

const port = process.env.PORT || 8080

module.exports = app.listen(port, function (err) {
  if (err) {
    console.log(err)
    return
  }
  console.log('Listening at http://localhost:' + port + '/api/vt\n')
  // http://localhost:8080/api/vt
})