var express = require('express');
var router = express.Router();
const moment = require('moment');

/* GET home page. */
router.get('/', function (req, res, next) {
  const years = new Date().getFullYear();
  res.render('index', { title: 'Day Facts', years, months: moment.months() });
});

router.get('/getFacts/*', function (req, res) {
  console.log("getFacts - START");
  const years = new Date().getFullYear();
  const { year: chosenYear, month: chosenMonth, day: chosenDay } = req.query;
  res.render('index', { title: 'Day Facts', chosenYear, chosenMonth, chosenDay, years, months: moment.months() });
  console.log("getFacts - END");
});

module.exports = router;
