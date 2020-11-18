'use strict';

// import modules
const functions = require('firebase-functions');
const admin = require('firebase-admin');
const apiController = require('./controller/ApiController');
const eventController = require('./controller/EventController');

// initialize the app
admin.initializeApp();

// initialize service
const apiControllerObject = new apiController();
const eventControllerObject = new eventController();

// validates the segment that a user added
exports.confirmSegment = functions.https.onRequest((request, response) => {
  apiControllerObject.confirmSegment(request, response);
});

// sends a confirmation email when a user adds a segment
exports.sendEmailConfirmation = functions.firestore.document('/users/{userId}/segments/{segmentId}').onCreate(async (snap, context) => {
  await eventControllerObject.sendEmailConfirmation(snap, context);
});

// get the results from a conversation after it finishes
exports.conversationResults = functions.firestore.document('/discoveries/{chatId}/results/{resultId}').onCreate(async (snap, context) => {
  await eventControllerObject.conversationResults(snap, context);
})

// notify the user about a new match
exports.matchNotification = functions.https.onRequest((request, response) => {
  return apiControllerObject.matchNotification(request, response);
});

// request a new match to the api
exports.matchRequest = functions.firestore.document('/users/{userId}/topics_hear/{topicName}').onCreate(async (snap, context) => {
  await eventControllerObject.matchRequest(snap, context);
})

// register a new discovery into the database
exports.registerDiscovery = functions.https.onRequest(async (request, response) => {
  await apiControllerObject.registerDiscovery(request, response);
})