// weather.js - APIs for openweathermap.org
(function () {

    const config = {
        units: 'metric',
        lan: 'en',
        format: 'json',
        APPID: null
    };

    // main settings
    const http = require('http.min');
    const options = {
        protocol: 'https:',
        hostname: 'api.openweathermap.org',
        path: '/data/2.5/weather?q=fairplay',
        headers: {
            'User-Agent': 'Node.js http.min'
        }
    };

    const weather = exports;

    // active functions()  -------------------------------------  active functions()  --------------------------------------------

    // function to make setInterval run once, then at interval
    weather.setIntervalImmediately = function setIntervalImmediately(func, interval) {
        func();
        return setInterval(func, interval);
    }

    weather.getURLCurrent = function getURL(settings) {
        return new Promise((resolve, reject) => {
            getCoordinateURLCurrent(settings, (error, url) => {
                if (url) {
                    resolve(url);
                } else {
                    reject(error);
                }
            });
        });
    }

    weather.getURLHourly = function getURL(settings) {
        return new Promise((resolve, reject) => {
            getCoordinateURLHourly(settings, (error, url) => {
                if (url) {
                    resolve(url);
                } else {
                    reject(error);
                }
            });
        });
    }

    weather.getURLDaily = function getURL(settings) {
        return new Promise((resolve, reject) => {
            getCoordinateURLDaily(settings, (error, url) => {
                if (url) {
                    resolve(url);
                } else {
                    reject(error);
                }
            });
        });
    }

    weather.getURLCurrentWeather = function getURL(settings) {
        return new Promise((resolve, reject) => {
            getCurrentWeatherURL(settings, (error, url) => {
                if (url) {
                    resolve(url);
                } else {
                    reject(error);
                }
            });
        });
    }

    weather.getURLOnecall = function getURL(settings) {
        return new Promise((resolve, reject) => {
            getOnecallURL(settings, (error, url) => {
                if (url) {
                    resolve(url);
                } else {
                    reject(error);
                }
            });
        });
    }

    weather.getURLAirPollution = function getURL(settings) {
        return new Promise((resolve, reject) => {
            getAirPollutionURL(settings, (error, url) => {
                if (url) {
                    resolve(url);
                } else {
                    reject(error);
                }
            });
        });
    }

    weather.getURLGeocode = function getURL(settings) {
        return new Promise((resolve, reject) => {
            getGeocodeURL(settings, (error, url) => {
                if (url) {
                    resolve(url);
                } else {
                    reject(error);
                }
            });
        });
    }

    weather.getWeatherData = function getWeatherData(url) {
        return new Promise((resolve, reject) => {
            getData(url, (error, jsonobj) => {
                if (jsonobj) {
                    resolve(jsonobj);
                } else {
                    reject(error);
                }
            });
        });
    }

    weather.beaufortFromKmh = function beaufortFromKmh(kmh) {
        let beaufortKmhLimits = [1, 6, 11, 19, 28, 38, 49, 61, 74, 88, 102, 117 ];
        // undefined for negative values...
        if (kmh < 0 || kmh == undefined) return undefined;

        let beaufortNum = beaufortKmhLimits.reduce(function (previousValue, currentValue, index, array) {
            return previousValue + (kmh > currentValue ? 1 : 0);
        }, 0);
        //return parseInt(beaufortNum);
        return beaufortNum;
    }

    weather.beaufortFromMph = function beaufortFromMph(mph) {
        let beaufortMphLimits = [1, 4, 8, 13, 19, 25, 32, 39, 47, 55, 64, 73, 111, 155, 208, 261, 320];
        // undefined for negative values...
        if (mph < 0 || mph == undefined) return undefined;

        let beaufortNum = beaufortMphLimits.reduce(function (previousValue, currentValue, index, array) {
            return previousValue + (mph > currentValue ? 1 : 0);
        }, 0);
        //return parseInt(beaufortNum);
        return beaufortNum;
    }

    weather.degToCompass = function degToCompass(num) {
        while (num < 0) num += 360;
        while (num >= 360) num -= 360;
        let val = Math.round((num - 11.25) / 22.5);
        var arr = ["N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE", "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW"];
        return arr[Math.abs(val)];
    }

    function getCoordinateURLCurrent(settings, callback) {
        let cityAvailable = settings["GEOlocationCity"];
        let ZipCodeAvailable = settings["GEOlocationZip"];
        let coordinateQuery = null;
        let forecastInterval = settings["forecastInterval"];
        if (cityAvailable) {
            coordinateQuery = 'q=' + encodeURI(settings["GEOlocationCity"]);
        } else if (ZipCodeAvailable) {
            coordinateQuery = 'zip=' + settings["GEOlocationZip"];
        } else {
            coordinateQuery = 'lat=' + settings['lat'] + '&lon=' + settings['lon'];
        }
        let url = '/data/2.5/weather?' + coordinateQuery + '&units=' + settings['units'] + '&lang=' + settings['language'] + '&mode=json&APPID=' + settings["APIKey"];
        return callback(null, url);
    };

    function getCoordinateURLHourly(settings, callback) {
        let cityAvailable = settings["GEOlocationCity"];
        let ZipCodeAvailable = settings["GEOlocationZip"];
        let coordinateQuery = null;
        if (cityAvailable) {
            coordinateQuery = 'q=' + encodeURIComponent(settings["GEOlocationCity"]);
        } else if (ZipCodeAvailable) {
            coordinateQuery = 'zip=' + settings["GEOlocationZip"];
        } else {
            coordinateQuery = 'lat=' + settings['lat'] + '&lon=' + settings['lon'];
        }
        let url = '/data/2.5/forecast?' + coordinateQuery + '&units=' + settings['units'] + '&lang=' + settings['language'] + '&mode=json&APPID=' + settings["APIKey"];
        return callback(null, url);
    };

    function getCoordinateURLDaily(settings, callback) {
        let cityAvailable = settings["GEOlocationCity"];
        let ZipCodeAvailable = settings["GEOlocationZip"];
        let coordinateQuery = null;
        //let forecastInterval = settings["forecastInterval"];
        if (cityAvailable) {
            coordinateQuery = 'q=' + encodeURIComponent(settings["GEOlocationCity"]);
        } else if (ZipCodeAvailable) {
            coordinateQuery = 'zip=' + settings["GEOlocationZip"];
        } else {
            coordinateQuery = 'lat=' + settings['lat'] + '&lon=' + settings['lon'];
        }
        let url = '/data/2.5/forecast/daily?' + coordinateQuery + '&units=' + settings['units'] + '&lang=' + settings['language'] + '&mode=json&APPID=' + settings["APIKey"] + '&cnt=16';
        return callback(null, url);
    };

    function getCurrentWeatherURL(settings, callback) {
        // OncallAPI only supports lan/lot, no city geocoding
        let coordinateQuery = 'lat=' + settings['lat'] + '&lon=' + settings['lon'];
        let url = '/data/2.5/weather?';
        url = url + coordinateQuery + '&units=' + settings['units'] + '&lang=' + settings['language'] + '&mode=json&APPID=' + settings["APIKey"];
        return callback(null, url);
    };

    function getOnecallURL(settings, callback) {
        // OncallAPI only supports lan/lot, no city geocoding
        // let cityAvailable = settings["GEOlocationCity"];
        // let ZipCodeAvailable = settings["GEOlocationZip"];
        let coordinateQuery = null;
        //let forecastInterval = settings["forecastInterval"];
        // if (cityAvailable) {
        //     coordinateQuery = 'q=' + encodeURI(settings["GEOlocationCity"]);
        // } else if (ZipCodeAvailable) {
        //     coordinateQuery = 'zip=' + settings["GEOlocationZip"];
        // } else {
            coordinateQuery = 'lat=' + settings['lat'] + '&lon=' + settings['lon'];
        // }
        let url = "";
        switch (settings["APIVersion"]){
            case "2.5":
                url = '/data/2.5/onecall?';
                break;
            case "3.0":
                url = '/data/3.0/onecall?';
                break; 
            default:
                url = '/data/3.0/onecall?';
                break;
        }
        url = url + coordinateQuery + '&units=' + settings['units'] + '&lang=' + settings['language'] + '&mode=json&APPID=' + settings["APIKey"];
        return callback(null, url);
    };

    function getAirPollutionURL(settings, callback) {
        // AirPollutionAPI only supports lan/lot, no city geocoding
        let coordinateQuery = null;
        coordinateQuery = 'lat=' + settings['lat'] + '&lon=' + settings['lon'];
        let url = '/data/2.5/air_pollution/forecast?' + coordinateQuery + '&appid=' + settings["APIKey"];
        return callback(null, url);
    };

    function getGeocodeURL(settings, callback) {
        let url = '/geo/1.0/direct?q=' + encodeURIComponent(settings["GEOlocationCity"]) + '&limit=10' + '&APPID=' + settings["APIKey"];
        return callback(null, url);
    };

    function getData(url, callback) {
        options.path = url;
        http.json(options).then(data => {
                //this.log(data)
                return callback(null, data);
            })
            .catch(err => {
                console.log(`problem with request: ${err.message}`);
                return callback(err, null);
            });
    }

})();