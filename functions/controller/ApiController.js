'use-strict'

// import modules
const apiService = require('../service/ApiService');

class ApiController {
    constructor() {
        // service
        this.apiServiceObject = new apiService();
    }

    confirmSegment(request, response) {
        this.apiServiceObject.confirmSegment(request, response);
    }

    matchNotification(request, response) {      
        return this.apiServiceObject.matchNotification(request, response);
    }
}

module.exports = ApiController;