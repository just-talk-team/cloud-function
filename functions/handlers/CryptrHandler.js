const cryptr = require('cryptr');

class Cryptr {
    constructor() {
        this.handler = new cryptr('justtalktoken');     
    }
    
    encrypt(text) {
        try {
            return this.handler.encrypt(text);
        } catch(error) {
            console.error('There was an error while encrypting: ', text, error);
            return -1;
        }
    }
       
    decrypt(text) {
        try {
            return this.handler.decrypt(text);
        } catch(error) {
            console.error('There was an error while decrypting: ', text, error);
            return -1;
        }
    }
}

module.exports = Cryptr;