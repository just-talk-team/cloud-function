'use-strict'

// import modules
const database = require('../handlers/DatabaseHandler');
const cryptr = require('../handlers/CryptrHandler');

class ApiService {
    constructor() {
        // handlers
        this.databaseHandler = new database();
        this.cryptrHandler = new cryptr();       
    }

    confirmSegment(request, response) {
        try {
            const key = request.query.key;
        
            const pathToSegment = this.cryptrHandler.decrypt(key);
            // construct the object to update in firebase
            const segmentObject = {
                'validate': true
            }
        
            // update the segment in firebase
            this.databaseHandler.update(pathToSegment, segmentObject);
            
            return response.send("Tu correo electrónico ha sido confirmado");
        } catch(error) {
            return response.send("Error");
        }
    }

    matchNotification(request, response) {      
        if (request.method === 'POST') {
            return response.status(200).json({message: 'Post request', data: request.body})
        } else if (request.method === 'GET') {
            return response.status(200).json({message: 'Get worked'})
        } else {
            return response.status(500).json({message: 'Provide a valid method (post or get)'})
        }
    }
}

module.exports = ApiService;