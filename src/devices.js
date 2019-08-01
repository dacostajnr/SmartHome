var path = require("path");
var fs = require('fs');

module.exports = {

    ReadConfig: async function () {
        return new Promise(function (resolve, reject) {
            var connections_cfg = [];
            var config_file_path = path.join(path.resolve('.'), '../../SmartHome/config/devices.json');

            fs.readFile(config_file_path, function (err, config_file) {

                if (err) {
                    console.log(err);
                    reject(err);
                }

                try {
                    config_json = JSON.parse(config_file);
                    return resolve(config_json);

                }
                catch (e) {
                    reject(e);
                }
            });
        });
    
    },
    ReadHVAC: async function () {
        return new Promise(function (resolve, reject) {
            var connections_cfg = [];
            var config_file_path = path.join(path.resolve('.'), '../../SmartHome/config/hvac.json');

            fs.readFile(config_file_path, function (err, config_file) {

                if (err) {
                    console.log(err);
                    reject(err);
                }

                try {
                    config_json = JSON.parse(config_file);
                    return resolve(config_json);

                }
                catch (e) {
                    reject(e);
                }
            });
        });
    
    },
    ReadRGBColors: async function () {
        return new Promise(function (resolve, reject) {
            var connections_cfg = [];
            var config_file_path = path.join(path.resolve('.'), '../../SmartHome/config/RGBWColors.json');

            fs.readFile(config_file_path, function (err, config_file) {

                if (err) {
                    console.log(err);
                    reject(err);
                }

                try {
                    config_json = JSON.parse(config_file);
                    return resolve(config_json);

                }
                catch (e) {
                    reject(e);
                }
            });
        });
    
    }
}

