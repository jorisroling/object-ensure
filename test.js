const eyes = require('eyes').inspector({ maxLength: -1, functions: false });
var object_ensure=require('./index.js');

const configSchema = {
    context:'demo',
    name:'config',
    schema: {
        rootpath: { //The configuration path. It should be the root of the project for now!
            type: String,
            required: true,
        },
        suites: { // Array of strings containing test directories
            type: [String],
            required: true,
        },
        hostname: { // The hostname of the machine
            type: String,
            required: false,
            default:'localhost'
        },
        grid: {   // Boolean indicating if you want to use the grid or local testing.
            type: Boolean,
            required: false,
            default:false
        },
        results: { // The hostname of the machine
            type: String,
            required: true,
            default:'results'
        },
        results_path: { // The location for the test json output
            type: String,
            required: true,
            default: function() {
                return `${this.rootpath}/.tmp/${this.results}`
            }
        },
        json_reporter_output: { // The location for the test json output
            type: String,
            required: true,
            default: function() {
                return `${this.results_path}/build.json`
            }
        },
    }
};


var config={
    rootpath:__dirname,
    suites:[''],
};

eyes({config});
object_ensure.validate(config,configSchema);
eyes({config});