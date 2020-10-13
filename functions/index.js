'use strict';

// import modules
const functions = require('firebase-functions');
const database = require('./handlers/database_handler');
const mail = require('./handlers/mail_handler');
const cryptr = require('./handlers/cryptr_handler');
const axios = require('axios');

// handlers
const mail_handler = new mail();
const database_handler = new database();
const cryptr_handler = new cryptr();

// validates the segment that a user added
exports.confirmSegment = functions.https.onRequest((request, response) => {
  const key = request.query.key;

  const pathToSegment = cryptr_handler.decrypt(key);
  // construct the object to update in firebase
  const segmentObject = {
    'validate': true
  }

  // update the segment in firebase
  database_handler.update(pathToSegment, segmentObject);

  response.send("Tu correo electrónico ha sido confirmado");
});

// sends a confirmation email when a user adds a segment
exports.sendEmailConfirmation = functions.firestore.document('/users/{userId}/segments/{segmentId}').onCreate(async (snap, context) => {
  
  // get created object
  const value = snap.data();

  // create constants for sending the mail and updating the object in firestore
  const email = value.email; 
  const pathToSegment = `users/${context.params.userId}/segments/${context.params.segmentId}`;
  const pathToConfirmationFunction = functions.config().apis.confirm_segment_function;
  // encrypt the pathToSegment constant;
  const key = cryptr_handler.encrypt(pathToSegment);
  // set expiration date to seven days from now
  const confirmationUrl = `${pathToConfirmationFunction}?key=${key}}`
  
  // construct mail options
  const mailOptions = {
    from: '"Just Talk." <just.talk.team.2021@gmail.com>',
    to: email,
  };
  mailOptions.subject = '¡Felicidades! Has agregado un nuevo segmento';
  mailOptions.text = `Acabas de añadir un nuevo segmento en tu cuenta de Just Talk. Por favor, verififica tu correo electrónico para completar la configuración: ${confirmationUrl}`;

  // send the email
  mail_handler.sendMail(mailOptions);

  // construct the object to update in firebase
  const validate = false;
  const segmentObject = {
    'key': key,
    'validate': validate
  }

  // update the segment in firebase
  database_handler.update(pathToSegment, segmentObject);
});

exports.conversationResults = functions.firestore.document('/users/{userId}').onWrite(async (change, context) => {
  
  const before = change.before;
  const after = change.after;
  const beforeData = before.data();
  const afterData = after.data();
  const deleteEvent = "google.firestore.document.delete";

  if(context.eventType === deleteEvent || JSON.stringify(beforeData.badgets) === JSON.stringify(afterData.badgets)) {
    return;
  }

  const user = await database_handler.getDocument('users', context.params.userId);
  const url = "https://us-central1-just-talk-2021.cloudfunctions.net/matchNotification"
  const body = {
    "user_type": user.user_type,
    "birthdate": user.birthdate,
    "topics_talk": [
        "COVID",
        "Clasicas de cachimbos"
    ],
    "topics_hear": user.topics_hear,
    "segments": [
        "upc.edu.pe"
    ],
    "user_type_qualified_user": "premium",
    "date_birth_qualified_user": "21/05/1993",
    "topics_talk_qualified_user": [
        "COVID",
        "Clasicas de cachimbos"
    ],
    "topics_hear_qualified_user": [
        "viajes a cuzco"
    ],
    "segments_qualified_user": [
        "upc.edu.pe"
    ],
    "start_time": "19/09/2020 17:00:00",
    "end_end": "19/09/2020 17:05:00",
    "badges_awarded": [
        "divertido"
    ]
  }
  
  await axios.post(url, body)
        .then(response => console.log(response.data.data))
        .catch(error => console.log(error))
})

exports.matchNotification = functions.https.onRequest((request, response) => {
  if (request.method === 'POST') {
    return response.status(200).json({message: 'Post request', data: request.body})
  }
  if (request.method === 'GET') {
    return response.status(200).json({message: 'Get worked'})
  }
});