// import modules for testing
const admin = require('firebase-admin');
const eventService = require('../service/EventService');
const assert = require('assert');

// tesing EventService
describe("EventService", async function() {
    admin.initializeApp();
    const eventServiceObject = new eventService();
    this.timeout(10000);
    it(`Escenario: Cuando se desea enviar un email de confirmacion`, async function () {
        const snap = {
            'data': function() {
                return { 'email': 'U201711778@upc.edu.pe', }
            }
        }
        const context = {
            'params': {
                'userId': '1kimc79FxJp4v5xLgy4D',
                'segmentId': 'upc.edu.pe'
            }
        }
        const functionResult = await eventServiceObject.sendEmailConfirmation(snap, context);
        assert.strictEqual(functionResult, 1, `No se envio el correo de confirmacion correctamente`);
    });
    it(`Escenario: Cuando se desean enviar los resultados de una conversacion`, async function () {
        const snap = {
            'data': function() {
                return { 
                    'start_time': new Date(),
                    'end_time': new Date(),
                    'badges': ['funny', 'good_talker']
                }
            }
        }
        const context = {
            'params': {
                'chatId': '2644mam0AFWcOOWpvc0QuoIOXv72_1kimc79FxJp4v5xLgy4D',
                'resultId': '1kimc79FxJp4v5xLgy4D'
            }
        }
        const functionResult = await eventServiceObject.conversationResults(snap, context);
        assert.strictEqual(functionResult, 1, `No se enviaron los resultados correctamente`);
    });
    it(`Escenario: Cuando se desea hacer una peticion de emparejamiento`, async function () {
        const snap = {}
        const context = {
            'params': {
                'userId': '1kimc79FxJp4v5xLgy4D',
                'topicName': 'Marvel'
            }
        }
        const functionResult = await eventServiceObject.matchRequest(snap, context);
        assert.strictEqual(functionResult, 1, `No se realizo la peticion correctamente`);
    });
    admin.app().delete();
});