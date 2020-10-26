// import modules for testing
const cryptr = require('../handlers/CryptrHandler');
const assert = require('assert');
const word = 'JustTalk'

// testing CryptHandler
describe("CryptHandler", function() {
    cryptrHandler = new cryptr();
    var encryptedText;
    it(`Escenario: Cuando se desee encriptar la palabra ${word}`, function() {
        encryptedText = cryptrHandler.encrypt(word);
        assert.notStrictEqual(encryptedText, -1, `No se encripto correctamente la palabra ${word}`)
    });
    it(`Escenario: Cuando se desee desencriptar la palabra ${word}`, function() {
        var decryptedText = cryptrHandler.decrypt(encryptedText);
        assert.strictEqual(decryptedText, word, `No se desencripto correctamente la palabra ${word}`)
    });
});