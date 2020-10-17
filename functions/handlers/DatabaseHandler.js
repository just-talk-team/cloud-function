'use-strict';

const admin = require('firebase-admin');

class Database {
    constructor() {
        this.database = admin.firestore();
    }

    update(pathToDocument, documentObject) {
        this.database.doc(pathToDocument).update(documentObject);
    }

    async getDocument(document) {
        const docRef = this.database.doc(document);

        const query = await docRef.get()
        .then(doc => {
            if (!doc.exists) {
                console.log('No such document!', document);
                return 'Not Found'
            }
            return doc.data();
        })
        .catch(err => {
            console.log('Error getting document', document, err);
        });

        return query;
    }

    async getFromUser(collection, userId) {
        const docRef = this.database.collection('users').doc(userId).collection(collection);

        const documents = docRef.get()
        .then(querySnapshot => {
            var ids = []
            querySnapshot.forEach(doc => {
                ids.push(doc.id);
            });
            return ids;
        })
        .catch(err => {
            console.log('Error getting documents in', document, err);
        });

        return documents;
    }
}

module.exports = Database;