const FBMessenger = require('../ui/messenger')
const messenger = new FBMessenger(process.env.FB_PAGE_TOKEN)
const session = require('../boombot/session')

module.exports = function(id, payload, message) {
	if (payload === "Ask Feedback") {
		messenger.sendTextMessage(id, "Would love to hear from you. You can type your feedback here or reach out to us at devletters@gmail.com")
		session.setState(id, "Expecting Feedback")
	}

	else if (payload === "Received Feedback") {
		messenger.sendTextMessage(id, "Thank you for your feedback.")
		session.setState(id, "Got Feedback")
		// save feedback in database eventually
	}
}
