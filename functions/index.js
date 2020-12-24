'use strict';

// import modules
const functions = require('firebase-functions');
const admin = require('firebase-admin');
const apiController = require('./controller/ApiController');
const eventController = require('./controller/EventController');

// initialize the app
admin.initializeApp();
const db = admin.firestore();

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

//Add documents job
exports.scheduleFunctionAddDoc =  functions.pubsub.schedule('*/30 * * * *')
    .timeZone('America/New_York')
    .onRun((context) => {
        var today = new Date();
        var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
        var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
        var dateTime = date+' '+time;
        admin.firestore().collection('sheduled-messages').add({original: dateTime});
        return null;
    })

//Delete collection job
exports.scheduleFunctionDeleteDoc = functions.pubsub.schedule('0 0 * * *')
.timeZone('America/New_York')
.onRun((context) => {
    //admin.initializeApp();
    var promises = [];

    deleteCollection(db,'sheduled-messages',100);
    return null;
})


function deleteCollection(db, collectionPath, batchSize) {
    let collectionRef = db.collection(collectionPath);
    let query = collectionRef.orderBy('__name__').limit(batchSize);
    
    return new Promise((resolve, reject) => {
        deleteQueryBatch(db, query, batchSize, resolve, reject);
    });
    }
    
    function deleteQueryBatch(db, query, batchSize, resolve, reject) {
    query.get()
        .then((snapshot) => {
        // When there are no documents left, we are done
        if (snapshot.size == 0) {
            return 0;
        }
    
        // Delete documents in a batch
        let batch = db.batch();
        snapshot.docs.forEach((doc) => {
            batch.delete(doc.ref);
        });
    
        return batch.commit().then(() => {
            return snapshot.size;
        });
        }).then((numDeleted) => {
        if (numDeleted === 0) {
            resolve();
            return;
        }
    
        // Recurse on the next process tick, to avoid
        // exploding the stack.
        process.nextTick(() => {
            deleteQueryBatch(db, query, batchSize, resolve, reject);
        });
        })
        .catch(reject);
    }
   