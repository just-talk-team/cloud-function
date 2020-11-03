'use strict'

const json = require('../service-account-dev.json');
const fs = require('fs');

/*json.private_key_id = process.env.CLOUD_PRIVATE_KEY_ID;
json.private_key = process.env.CLOUD_PRIVATE_KEY;
json.client_email = process.env.CLOUD_CLIENT_EMAIL;
json.client_id = process.env.CLOUD_CLIENT_ID;
json.project_id = process.env.ALIAS_DEVELOPMENT;*/

json.private_key_id = "e3e5214158c8042001a69e60348ffd1068dc5e98";
json.private_key = "-----BEGIN__PRIVATE__KEY-----\\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDbeCi9uskvCKjp\\nz5VVaqYMx3wQy2jOGjGI8gaXSun2eSFPPUmtxYx6rna+Kg9VFj9QEG7bx+DacEKd\\n6QU/ZHK4ruwOGlKin4lR7TUwrsaqoIdQZ+TwRWlb3cuKRHOOG0gxPxO5zkoOO4/D\\nGRD4yAR9mde5DWyebs4WN4hTu7Q9CHXSN17CxX5WlTmvlzYIoDem0k3kAbsrxOuf\\nX6uGC26YRidx7LDoMyX0RDijXYl1IN0oEgEoP8f3uI30g6FSTKDGaemlmqjbcKQ2\\n5futPZPBKJC/zyDJPNyMBKUnubd1KsqVW0tCGKykMDqt7ufN4D2Eg50pR4YXjSFs\\nUzmCyTMdAgMBAAECggEAAQJmt5FWxbQFvjDhotyvH6hsN5Hj7RdoP7+94YTAmjeu\\nPEnPygWPqEHJ/dpo1c9Dd8gM5nm0ckoUDbC0a46ioMWnLsfBYQpC91Y+tCGy/Au/\\nIOggFgMlC/0zZ4hPOr8BNZQbcF4/RMen2THHPEmujEWrR73aJclkgmwmIPJ1pAE2\\nL/Lhayg1Z11Wl/rI7pNCcNIQ46sltng3A90wVermNZvB702op4xa24QtA5PvCIt4\\nryUD7WxANwgwnHlbYKBsATaurPcB+ZQ7E1wZwXBs0OpNSef4FvrS4dtMqNiNr+I1\\nZTOmKRr33vcqqmCiBBfD8oq8LQSUsNzEjjkK3cZOoQKBgQD+ZoN9RlPQnEcNRpMK\\nU8JxME/pXhRaNzZoPMdhHkdofJQ4r+d35DrlyoMqsiY1pyEUFtr0XDbXoWCjtqfN\\nUvOVcvDd/Sg2/0wgRmI0KsD3I42eY8POy7p0xq3ggYTKhWHOz8qW1Y6/G6GActs+\\n/sVJeCMsC9ehPFXuREkbl5pnfQKBgQDc2WuEmEr7l0cPecCDKfsiVYWKeQPGNWEE\\nRgpIwgTjoiDfxbEs8vms6j0r4LLhTlBGz11ZkleGkZf87dZKxma78N0Be49xku0b\\nd3po2OS4WrERd1uDk9eYqoBxJo6ARtvJGdKk64tvLqOQ7iwGwCUKS1rOm9bEjzyB\\nzCid5agMIQKBgQCkHTHaERJk00wqzkpxMROQvV/v5lcu08tvdzYP+t6KE0PzRdcG\\nyt8L+pafZomrtwNp2EyrswlWFa8oLd8WX9rvoFSugG/++rb7YyxbBvGw/OiRMz7Q\\nGzFPwBPPbv5hP6aXKglBQMdzlbmcCXxSqTxQZwYZlhIm26t7p+WZvTVIaQKBgCNo\\nLCeu7t6VK0xc3bNpqJyhj25a5nMBndM8k2uEx5njJVga7sPhFIxXZYVCWgtrLc2c\\ncz/oCWZGs1JWozOLyW66OASD1cSEpMTxi8uBcnHoAFlnhGF882TDeSIq50/DjHsa\\nS74rEUi69nhG5wISDh4vZJiZPX535GB+5cgiyKVhAoGAYWHOjiLY4JDpq06Drwof\\nQ60KqELet3B9Ud9Db193MPQlX4YFiv0YuQ+nzlNd/LqMWxa2WKAM9le0WHn/WjDm\\nruxG6Yx4D/SJ/u3I5tvy5bP7/P7erivaXwiMp8Uto5vvbsEAQm0InAYrAuTHPVSm\\nnoT9b3buxRdT08i4pWMitco=\\n-----END__PRIVATE__KEY-----\\n"
json.client_email = "just-talk-dev@appspot.gserviceaccount.com";
json.client_id = "107843150159640228511";
json.project_id = "just-talk-dev";

// convert JSON object to string
const data = JSON.stringify(json).replace(/\\n/g, "n").replace(/__/g, " ");

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
    /*{
        "gmail": {
            "password": process.env.GMAIL_PASSWORD,
            "email": process.env.GMAIL_EMAIL
        },
        "apis": {
            "confirm_segment_function": process.env.APIS_CONFIRM_SEGMENT_FUNCTION,
            "api_dashboard": process.env.APIS_API_DASHBOARD,
            "match_request": process.env.APIS_MATCH_REQUEST
        }
    }*/
    {
        "gmail": {
          "email": "just.talk.team.2021@gmail.com",
          "password": "zvdoymeeucflsgxw"
        },
        "apis": {
          "confirm_segment_function": "https://us-central1-just-talk-dev.cloudfunctions.net/confirmSegment",
          "match_request": "https://us-central1-just-talk-dev.cloudfunctions.net/matchNotification",
          "api_dashboard": "https://us-central1-just-talk-dev.cloudfunctions.net/matchNotification"
        }
      }
);