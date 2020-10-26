'use-strict'

// import modules
const functions = require('firebase-functions');
const database = require('../handlers/DatabaseHandler');
const mail = require('../handlers/MailHandler');
const cryptr = require('../handlers/CryptrHandler');
const axios = require('axios');

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
            const pathToConfirmationFunction = functions.config().apis.confirm_segment_function;
            // encrypt the pathToSegment constant;
            const key = this.cryptrHandler.encrypt(pathToSegment);
            // set expiration date to seven days from now
            const confirmationUrl = `${pathToConfirmationFunction}?key=${key}}`
            
            // construct mail options
            const mailOptions = {
                from: '"Just Talk." <just.talk.team.2021@gmail.com>',
                to: email,
            };
            mailOptions.subject = '¡Felicidades! Has agregado un nuevo segmento';
            mailOptions.text = `Acabas de añadir un nuevo segmento en tu cuenta de Just Talk. Por favor, verifica tu correo electrónico para completar la configuración: ${confirmationUrl}`;
        
            // send the email
            await this.mailHandler.sendMail(mailOptions);
        
            // construct the object to update in firebase
            const validate = false;
            const segmentObject = {
                'key': key,
                'validate': validate
            }
        
            // update the segment in firebase
            await this.databaseHandler.update(pathToSegment, segmentObject);
            return 1;
        } catch(error) {
            return -1;
        }
    }
    
    async conversationResults(snap, context) {
        try {

            const snapData = snap.data();
            const chatId = context.params.chatId;
        
            const userIdString = JSON.stringify(chatId).split("_")[0];
            const qualifiedIdString = JSON.stringify(chatId).split("_")[1];
        
            const userId = userIdString.substring(1, userIdString.length);
            const qualifiedId = qualifiedIdString.substring(0, qualifiedIdString.length-1);
            const userPath = 'users/'+userId;
            const qualifiedPath = 'users/'+qualifiedId;
        
            const user = await this.databaseHandler.getDocument(userPath);
            const qualified = await this.databaseHandler.getDocument(qualifiedPath);
            const userSegments = await this.databaseHandler.getFromUser('segments', userId);
            const qualifiedSegments = await this.databaseHandler.getFromUser('segments', qualifiedId);
            const userTopicsTalk = await this.databaseHandler.getFromUser('topics_talk', userId);
            const qualifiedTopicsTalk = await this.databaseHandler.getFromUser('topics_talk', qualifiedId);
        
        
            const apiDashboard = functions.config().apis.api_dashboard;
            const body = {
                "user_type": user.user_type,
                "birthdate": user.birthdate,
                "topics_hear": user.topics_hear,
                "topics_talk": userTopicsTalk,
                "segments": userSegments,
                "user_type_qualified": qualified.user_type,
                "birthdate_qualified": qualified.birthdate,
                "topics_talk_qualified": qualifiedTopicsTalk,
                "topics_hear_qualified": qualified.topics_hear,
                "segments_qualified": qualifiedSegments,
                "start_time": snapData.start_time,
                "end_time": snapData.end_time,
                "badges_awarded": snapData.badges
            }
            
            await axios.post(apiDashboard, body)
                    .then(response => console.log(response.data.data))
                    .catch(error => console.log(error))
            return 1;
        } catch(error) {
            return -1;
        }
    }
}

module.exports = EventService;