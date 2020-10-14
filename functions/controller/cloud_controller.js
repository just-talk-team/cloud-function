'use strict';

// import modules
const functions = require('firebase-functions');
const service = require('../service/cloud_service')

// initialize service
const cloud_service = new service();

// validates the segment that a user added
exports.confirmSegment = functions.https.onRequest((request, response) => {
  cloud_service.confirmSegment(request, response);
});

// sends a confirmation email when a user adds a segment
exports.sendEmailConfirmation = functions.firestore.document('/users/{userId}/segments/{segmentId}').onCreate(async (snap, context) => {
  await cloud_service.sendEmailConfirmation(snap, context);
});

// get the results from a conversation after it finishes
exports.conversationResults = functions.firestore.document('/chats/{chatId}/information/duration').onUpdate(async (change, context) => {
  await cloud_service.conversationResults(change, context);
})

// notify the user about a new match
exports.matchNotification = functions.https.onRequest((request, response) => {
  return cloud_service.matchNotification(request, response);
});