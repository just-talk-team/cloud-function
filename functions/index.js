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
exports.conversationResults = functions.firestore.document('/chats/{chatId}/results/{resultId}').onCreate(async (snap, context) => {
  await eventControllerObject.conversationResults(snap, context);
})

// notify the user about a new match
exports.matchNotification = functions.https.onRequest((request, response) => {
  return apiControllerObject.matchNotification(request, response);
});