const express = require('express');

const router = express.Router();
const moment = require('moment');
const stations = require('../helpers/stations');

/* GET home page. */
router.get('/', (req, res) => {
    const years = new Date().getFullYear();
    res.render('index', {
        title: 'Day Facts',
        stations,
        years,
        months: moment.months(),
    });
});

module.exports = router;
