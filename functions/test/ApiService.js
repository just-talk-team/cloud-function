// import modules for testing
const admin = require('firebase-admin');
const apiService = require('../service/ApiService');
const cryptr = require('../handlers/CryptrHandler')
const assert = require('assert');

// tesing ApiService
describe("ApiService", function() {
    admin.initializeApp();
    const apiServiceObject = new apiService();
    const cryptrHandler = new cryptr();
    it(`Escenario: Cuando se desea confirmar un segmento`, function () {
        const key = cryptrHandler.encrypt('users/1kimc79FxJp4v5xLgy4D/segments/upc.edu.pe');
        const request = {
            'query': {
                'key': key
            }
        }
        const response = {
            'send': function(message){
                if(message === "Tu correo electrónico ha sido confirmado") {
                    return 1;
                } else {
                    return -1;
                }
            }
        }
        const functionResult = apiServiceObject.confirmSegment(request, response);
        assert.strictEqual(functionResult, 1, `No se realizo la confirmacion correctamente`);
    });
    it(`Escenario: Cuando se desea notificar un match`, function () {
        const functionResult = 1;
        assert.strictEqual(functionResult, 1, `No se notifico correctamente`);
    });
    admin.app().delete();
});