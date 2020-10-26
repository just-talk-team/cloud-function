'use strict'

const json = require('../service-account-dev.json');
const fs = require('fs');

json.private_key_id = process.env.CLOUD_PRIVATE_KEY_ID;
json.private_key = process.env.CLOUD_PRIVATE_KEY;
json.client_email = process.env.CLOUD_CLIENT_EMAIL;
json.client_id = process.env.CLOUD_CLIENT_ID;
json.project_id = process.env.ALIAS_DEVELOPMENT;

// convert JSON object to string
const data = JSON.stringify(json).replace(/\\n/g, "n").replace(/\"/g, "");

console.log(data);

// write JSON string to a file
fs.writeFileSync('./service-account-dev.json', data, (err) => {
    if (err) {
        throw err;
    }
    console.log("JSON data is saved.");
});

// defining test environment
const test = require('firebase-functions-test')({
    databaseURL: 'https://just-talk-dev.firebaseio.com',
    storageBucket: 'just-talk-dev.appspot.com',
    projectId: 'just-talk-dev',
}, './service-account-dev.json');

test.mockConfig(
    {
        "gmail": {
            "password": process.env.GMAIL_PASSWORD,
            "email": process.env.GMAIL_EMAIL
        },
        "apis": {
            "confirm_segment_function": process.env.APIS_CONFIRM_SEGMENT_FUNCTION,
            "api_dashboard": process.env.APIS_API_DASHBOARD
        }
    }
);