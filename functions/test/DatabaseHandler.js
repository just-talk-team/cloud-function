// import modules for testing
const admin = require('firebase-admin');
const database = require('../handlers/DatabaseHandler');
const assert = require('assert');

// tesing DatabaseHandler
describe("DatabaseHandler", async function() {
    admin.initializeApp();
    const databaseHandler = new database();
    this.timeout(5000);
    it(`Escenario: Cuando se desee actualizar un documento`, async function () {
        const pathToDocument = 'users/2644mam0AFWcOOWpvc0QuoIOXv72';
        const documentObject = {
            'birthdate': new Date(),
            'gender': 'man',
            'nickname': 'anthony',
            'topics_hear': ['DC Comics', 'Star Wars'],
            'user_type': 'premium'
        };
        const updateResult = await databaseHandler.update(pathToDocument, documentObject);
        assert.strictEqual(updateResult, 1, `No se actualizo el documento correctamente`);
    });
    it(`Escenario: Cuando se desee obtener un documento`, async function() {
        const document = 'users/2644mam0AFWcOOWpvc0QuoIOXv72';
        const documentQueryResult = await databaseHandler.getDocument(document);
        assert.notStrictEqual(documentQueryResult, -1, `No se obtuvo el documento correctamente`)
    });
    it(`Escenario: Cuando se desee obtener los documentos de un usuario`, async function() {
        const collection = 'segments';
        const userId = '2644mam0AFWcOOWpvc0QuoIOXv72';
        const userDocumentQueryResult = await databaseHandler.getFromUser(collection, userId);
        assert.notStrictEqual(userDocumentQueryResult, -1, `No se obtuvieron los documentos correctamente`)
    });
    admin.app().delete();
});