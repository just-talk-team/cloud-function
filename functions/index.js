'use strict';

// import modules
const functions = require('firebase-functions');
const database = require('./handlers/database_handler');
const mail = require('./handlers/mail_handler');
const cryptr = require('./handlers/cryptr_handler')

// handlers
const mail_handler = new mail();
const database_handler = new database();
const cryptr_handler = new cryptr();

// validates the segment that a user added
exports.confirmSegment = functions.https.onRequest((request, response) => {
  const key = request.query.key;
  const expirate = request.query.exp;
  const dateNow = new Date();

  // if the url did not expire, then validates the segment
  if(expirate > dateNow.getTime())
  {
    // decrypt the key
    const pathToSegment = cryptr_handler.decrypt(key);
    // construct the object to update in firebase
    const segmentObject = {
      'validate': true
    }

    // update the segment in firebase
    database_handler.update(pathToSegment, segmentObject);

    response.send("Tu correo electrónico ha sido confirmado");
  } else {
    response.send("Este enlace ya no es válido");
  }
});

// sends a confirmation email when a user adds a segment
exports.sendEmailConfirmation = functions.firestore.document('/users/{userId}/segments/{segmentId}').onWrite(async (change, context) => {
  
  const deletionEvent = "google.firestore.document.delete";
  
  // If the email changed and the object was not deleted, then continue
  if(context.eventType === deletionEvent || (change.after.data().email === change.before.data().email)) {
    return;
  }
  
  // get updated object
  const snapshot = change.after;
  const value = snapshot.data();

  // create constants for sending the mail and updating the object in firestore
  const email = value.email;  
  const pathToSegment = `users/${context.params.userId}/segments/${context.params.segmentId}`;
  const pathToConfirmationFunction = functions.config().apis.confirm_segment_function;
  // encrypt the pathToSegment constant;
  const key = cryptr_handler.encrypt(pathToSegment);
  // set expiration date to seven days from now
  const timeNow = new Date();
  const sevenDaysInMiliseconds = 7*24*60*60*1000;
  const expirate = new Date(timeNow.getTime() + sevenDaysInMiliseconds);
  const confirmationUrl = `${pathToConfirmationFunction}?key=${key}&exp=${expirate.getTime()}`
  
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
    'expirate': expirate,
    'key': key,
    'validate': validate
  }

  // update the segment in firebase
  database_handler.update(pathToSegment, segmentObject);
});