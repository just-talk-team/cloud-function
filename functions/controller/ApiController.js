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

    async registerDiscovery(request, response) {
        return await this.apiServiceObject.registerDiscovery(request, response);
    }
}

module.exports = ApiController;