'use-strict'

// import modules
const eventService = require('../service/EventService');

class EventController {
    constructor() {
        // service
        this.eventServiceObject = new eventService();
    }
    
    async sendEmailConfirmation(snap, context) {
        this.eventServiceObject.sendEmailConfirmation(snap, context);
    }
    
    async conversationResults(snap, context) {
        this.eventServiceObject.conversationResults(snap, context);
    }

    async matchRequest(snap, context) {
        this.eventServiceObject.matchRequest(snap, context);
    }
}

module.exports = EventController;