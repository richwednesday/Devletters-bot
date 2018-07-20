const FBMessenger = require('../ui/messenger')
const messenger = new FBMessenger(process.env.FB_PAGE_TOKEN)
const session = require('../boombot/session')
const fetch = require('node-fetch');

module.exports = function(id, payload, details) {
	if (payload === "ASKSubscribe") {
		let split = details.split('/')
		let choice = split[2]

		if (choice === "1") {
			let groupId = split[1]
			fetch(`${process.env.CORE_URL}/groups/subscribe`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					masterKey: process.env.CORE_API_KEY,
					uid: id,
					groupId	
				})
			})
			.then(res => {
				if (res.status === 200) messenger.sendTextMessage(id, "You have been successfully subscribed to this group.")
				else messenger.sendTextMessage(id, "An error occured in your subscription, please try again later.")
			})
			.catch(err => {
				console.log(err)
				messenger.sendTextMessage(id, "An error occured in your subscription, please try again later.")
			})
		}

		else if (choice === "0") messenger.sendTextMessage(id, "Alright.")
		session.setState(id, "Clear")
	}

	else if (payload === "Manage") {
		// get all subscribed groups, and ask user to select
	}

}



