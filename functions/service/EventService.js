"use-strict";

// import modules
const functions = require("firebase-functions");
const database = require("../handlers/DatabaseHandler");
const mail = require("../handlers/MailHandler");
const cryptr = require("../handlers/CryptrHandler");
const axios = require("axios");
const admin = require("firebase-admin");

class EventService {
  constructor() {
    // handlers
    this.mailHandler = new mail();
    this.databaseHandler = new database();
    this.cryptrHandler = new cryptr();
  }

  async sendEmailConfirmation(snap, context) {
    try {
      // get created object
      const value = snap.data();

      // create constants for sending the mail and updating the object in firestore
      const email = value.email;
      const pathToSegment = `users/${context.params.userId}/segments/${context.params.segmentId}`;
      const pathToConfirmationFunction = functions.config().apis
        .confirm_segment_function;
      // encrypt the pathToSegment constant;
      const key = this.cryptrHandler.encrypt(pathToSegment);
      // set expiration date to seven days from now
      const confirmationUrl = `${pathToConfirmationFunction}?key=${key}}`;

      // construct mail options
      const mailOptions = {
        from: '"Just Talk." <just.talk.team.2021@gmail.com>',
        to: email,
      };
      mailOptions.subject = "¡Felicidades! Has agregado un nuevo segmento";
      mailOptions.text = `Acabas de añadir un nuevo segmento en tu cuenta de Just Talk. Por favor, verifica tu correo electrónico para completar la configuración: ${confirmationUrl}`;

      // send the email
      await this.mailHandler.sendMail(mailOptions);

      // construct the object to update in firebase
      const validate = false;
      const segmentObject = {
        key: key,
        validate: validate,
      };

      // update the segment in firebase
      await this.databaseHandler.update(pathToSegment, segmentObject);
      return 1;
    } catch (error) {
      return -1;
    }
  }

  async conversationResults(snap, context) {
    try {
      const snapData = snap.data();
      const chatId = context.params.chatId;
      const resultId = context.params.resultId;

      const userIdString = JSON.stringify(chatId).split("_")[0];
      const qualifiedIdString = JSON.stringify(chatId).split("_")[1];

      var userId = userIdString.substring(1, userIdString.length);
      var qualifiedId = qualifiedIdString.substring(
        0,
        qualifiedIdString.length - 1
      );

      if (qualifiedId === resultId) {
        qualifiedId = userId
        userId = resultId
      }

      const userPath = "users/" + userId;
      const qualifiedPath = "users/" + qualifiedId;

      const user = await this.databaseHandler.getDocument(userPath);
      const qualified = await this.databaseHandler.getDocument(qualifiedPath);
      const userSegments = await this.databaseHandler.getListIdDocumentsOfCollectionInUser(
        "segments",
        userId
      );
      const qualifiedSegments = await this.databaseHandler.getListIdDocumentsOfCollectionInUser(
        "segments",
        qualifiedId
      );
      const userTopicsTalk = await this.databaseHandler.getListIdDocumentsOfCollectionInUser(
        "topics_talk",
        userId
      );
      const qualifiedTopicsTalk = await this.databaseHandler.getListIdDocumentsOfCollectionInUser(
        "topics_talk",
        qualifiedId
      );
      const userTopicsHear = await this.databaseHandler.getListIdDocumentsOfCollectionInUser(
        "topics_hear",
        userId
      );
      const qualifiedTopicsHear = await this.databaseHandler.getListIdDocumentsOfCollectionInUser(
        "topics_hear",
        qualifiedId
      );

      const birthdate_parsed = new Date(user.birthdate._seconds * 1000 + user.birthdate._nanoseconds * 0.000001)
      const birthdate_parsed_qualified = new Date(qualified.birthdate._seconds * 1000 + qualified.birthdate._nanoseconds * 0.000001)
      const start_time_parsed = new Date(snapData.start_time._seconds * 1000 + snapData.start_time._nanoseconds * 0.000001)
      const end_time_parsed = new Date(snapData.end_time._seconds * 1000 + snapData.end_time._nanoseconds * 0.000001)

      const apiDashboard = functions.config().apis.api_dashboard;
      const body = {
        user_type: user.user_type,
        birthdate: birthdate_parsed,
        gender: user.gender,
        topics_hear: userTopicsHear,
        topics_talk: userTopicsTalk,
        segments: userSegments,
        user_type_qualified_user: qualified.user_type,
        birthdate_qualified_user: birthdate_parsed_qualified,
        gender_qualified_user: qualified.gender,
        topics_talk_qualified_user: qualifiedTopicsTalk,
        topics_hear_qualified_user: qualifiedTopicsHear,
        segments_qualified_user: qualifiedSegments,
        start_time: start_time_parsed,
        end_time: end_time_parsed,
        badges_awarded: snapData.badges,
      };

      axios
        .post(apiDashboard, body)
        .then((response) => console.log('Results', response))
        .catch((error) => console.log(error));
      return 1;
    } catch (error) {
      return -1;
    }
  }

  async matchRequest(snap, context) {
    try {
      const topicSelected = context.params.topicName;
      const userId = context.params.userId;

      const userBadges = await this.databaseHandler.getListIdDocumentsOfCollectionInUser(
        "badges",
        userId
      );
      const userTopicsTalk = await this.databaseHandler.getListIdDocumentsOfCollectionInUser(
        "topics_talk",
        userId
      );

      const userPath = "users/" + userId;
      const user = await this.databaseHandler.getDocument(userPath);
      const segments = user.preferences.segments;

      for (let segment of segments) {
        for (let topicTalk of userTopicsTalk) {
          const pathToSegment = `/segments/${segment}/topics/${topicTalk}`;
          const segmentObject = {
            time: new Date(),
          };
          this.databaseHandler.write(pathToSegment, segmentObject);
        }
      }

      const apiMatchRequest = functions.config().apis.match_request;
      const body = {
        id: userId,
        birthdate: user.birthdate,
        gender: user.gender,
        user_type: user.user_type,
        segments: segments,
        badges: userBadges,
        preferences: user.preferences,
        topics_hear: [topicSelected],
        topics_talk: userTopicsTalk,
      };
      axios
        .post(apiMatchRequest, body)
        .then((response) => console.log('Match request', response))
        .catch((error) => console.log(error));
      return 1;
    } catch (error) {
      return -1;
    }
  }
}

module.exports = EventService;
