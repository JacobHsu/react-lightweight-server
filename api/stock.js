"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getStockInfo = void 0;
const tslib_1 = require("tslib");
const faker_1 = tslib_1.__importDefault(require("faker"));
const yahooFinance = require('yahoo-finance') // https://www.npmjs.com/package/yahoo-finance
const moment = require('moment')
var _ = require('lodash');

const d = new Date();
const today = d.toISOString().substring(0, 10);

let twoWeeksAgo = d.setDate(d.getDate() - 365);
twoWeeksAgo = new Date(twoWeeksAgo).toISOString().substring(0, 10);;


let historical = function (symbol, from, to, callback) {
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
      // console.log(quotes)
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

const getTransactions = (req, res) => {
    return res.json({
        code: 0,
        result: {
          token: faker_1.default.datatype.uuid(),
          etf: retJSON.quotes,
          candlestickSeries: retJSON.candlestickSeries,
          volumeSeries: retJSON.volumeSeries
        },
        message:"ok",
        type:"success"
    });
};
exports.getStockInfo = getTransactions;
