/* eslint-disable linebreak-style */
const express = require('express');
const moment = require('moment');
const axios = require('axios');
const stations = require('../helpers/stations');

const router = express.Router();

const getDateFacts = async (yearStr, monthStr, dayStr) => {
    let topSong;
    let topMovie;

    const data = {
        dayStr,
        monthStr,
        yearStr,
        getCountry: '0',
    };
    const { data: dateFacts } = await axios.request({
        method: 'post',
        url: 'https://www.mybirthdayfacts.com/MBFService.asmx/FetchDayHeadlines',
        data,
    });

    if (Object.keys(dateFacts.d).length > 4) {
        topSong = dateFacts.d[3].s.replace('|MBF|', ' by ');
    } else {
        topSong = 'No Top Song Data Available';
    }

    if (Object.keys(dateFacts.d).length > 4) {
        topMovie = dateFacts.d[4].s;
    } else {
        topMovie = 'No Top Movie Data Available';
    }

    return [topSong, topMovie];
};

const getDateWeather = async (yearStr, monthStr, chosenStation) => {
    let splitStr;
    let tmax;
    let tmin;
    let ad;
    let rain;
    let sun;

    const { data: dateWeather } = await axios.request({
        method: 'get',
        url: `https://www.metoffice.gov.uk/pub/data/weather/uk/climate/stationdata/${chosenStation.replace(' ', '').toLowerCase()}data.txt`,
    });

    if (monthStr.length > 1) {
        splitStr = `${yearStr}  ${monthStr}`;
    } else {
        splitStr = `${yearStr}   ${monthStr}`;
    }

    const weatherFromDate = dateWeather.split(splitStr)[1];
    if (weatherFromDate) {
        [, tmax, tmin, ad, rain, sun] = weatherFromDate.split(/\s{1,10}/g);
    } else {
        tmax = 'No Max Temperature Data Available';
        tmin = 'No Min Temperature Data Available';
        ad = 'No Air Frost Data Available';
        rain = 'No Amount of Rain Data Available';
        sun = 'No Hours of Sun Data Available';
    }

    if (sun === '---') {
        sun = 'No Hours of Sun Data Available';
    }

    return [tmax, tmin, ad, rain, sun];
};

router.get('/', async (req, res) => {
    try {
        const getDateData = [];
        const years = new Date().getFullYear();
        const {
            year: yearStr,
            month: monthStr,
            day: dayStr,
            station: chosenStation,
        } = req.query;

        // get facts on date
        getDateData.push(getDateFacts(yearStr, monthStr, dayStr));
        // get weather on month and year
        getDateData.push(getDateWeather(yearStr, monthStr, chosenStation));

        const [
            // getFacts
            [
                topSong,
                topMovie,
            ],
            // getWeather
            [
                tmax,
                tmin,
                ad,
                rain,
                sun,
            ],
        ] = await Promise.all(getDateData);

        res.render('getFacts', {
            title: 'Day Facts',
            years,
            yearStr,
            months: moment.months(),
            monthStr,
            dayStr,
            stations,
            chosenStation,
            topSong,
            topMovie,
            tmax,
            tmin,
            ad,
            rain,
            sun,
        });
    } catch (e) {
        throw new Error(e);
    }
});

module.exports = router;
