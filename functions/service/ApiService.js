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

    async registerDiscovery(request, response) {
        try {
            const idFirstPerson = request.body.idFirstPerson;
            const idSecondPerson = request.body.idSecondPerson;
            var idDiscovery;
            if (idFirstPerson > idSecondPerson) {
                idDiscovery = `${idFirstPerson}_${idSecondPerson}`
            } else {
                idDiscovery = `${idSecondPerson}_${idFirstPerson}`
            }

            const pathToFirstPerson = `/users/${idFirstPerson}/discoveries/${idDiscovery}`;
            const pathToSecondPerson = `/users/${idSecondPerson}/discoveries/${idDiscovery}`;

            const firstPersonObject = {
                'time': new Date(),
                'room': idDiscovery,
                'match': idSecondPerson,
            }
            const secondPersonObject = {
                'time': new Date(),
                'room': idDiscovery,
                'match': idFirstPerson,
            }
        
            this.databaseHandler.write(pathToFirstPerson, firstPersonObject);
            this.databaseHandler.write(pathToSecondPerson, secondPersonObject);

            const pathToFirstPersonDiscovery = `/discoveries/${idDiscovery}/users/${idFirstPerson}`
            const pathToSecondPersonDiscovery = `/discoveries/${idDiscovery}/users/${idSecondPerson}`

            const firstPersonDiscoveryObject = {
                'activated': false
            }
            const secondPersonDiscoveryObject = {
                'activated': false
            }
            
            await this.databaseHandler.write(pathToFirstPersonDiscovery, firstPersonDiscoveryObject);
            await this.databaseHandler.write(pathToSecondPersonDiscovery, secondPersonDiscoveryObject);

            return response.status(200).json({message: 'Succesful'})
        } catch(error) {
            return response.status(500).json({message: 'There was an unexpected error'})
        }
    }
}

module.exports = ApiService;