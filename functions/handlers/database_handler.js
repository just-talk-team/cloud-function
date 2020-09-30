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
}

module.exports = Database;