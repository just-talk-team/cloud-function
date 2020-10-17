const cryptr = require('cryptr');

class Cryptr {
    constructor() {
        this.handler = new cryptr('justtalktoken');     
    }
    
    encrypt(text) {
        return this.handler.encrypt(text);
    }
       
    decrypt(text) {
        return this.handler.decrypt(text);
    }
}

module.exports = Cryptr;