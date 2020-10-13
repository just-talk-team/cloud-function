'use-strict';

const admin = require('firebase-admin');

class Database {
    constructor() {
        admin.initializeApp();
        this.database = admin.firestore();
    }

    update(pathToDocument, documentObject) {
        this.database.doc(pathToDocument).update(documentObject);
    }

    async getDocument(collection, document) {
        const docRef = this.database.collection(collection).doc(document);

        const query = await docRef.get()
        .then(doc => {
            if (!doc.exists) {
                console.log('No such document!');
                return 'Not Found'
            } 
            return doc.data();
        })
        .catch(err => {
            console.log('Error getting document', err);
        });

        return query;
    }
}

module.exports = Database;