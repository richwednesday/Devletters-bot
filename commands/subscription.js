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
		fetch(`${process.env.CORE_URL}/user/subscriptions?uid=${id}&masterKey=${process.env.CORE_API_KEY}`)
      .then(res => res.json())
      .then(json => {
				console.log(json)
				if (!json.length) return messenger.sendTextMessage(id, "You are currently not subscribed to any group.")

				let elements = []
				for (let group of json) {
					elements.push({
						title: group.name,
						subtitle: group.desc,
						image_url: group.image_url,
						buttons: [{
							type: "postback",
							title: "Unsubscribe",
							payload: `Unsubscribe||${group.id}||${group.name}`
						}]
					})
					if (elements.length === 9) break;
				}
				messenger.sendTextMessage(id, "Select a group to unsubscribe from.", () => {
					messenger.sendHScrollMessage(id, elements)
				})
			})
	}

	else if (payload === "Unsubscribe") {
		let split = details.split('||')
		let groupId = split[1]
		let name = split[2]

		fetch(`${process.env.CORE_URL}/groups/unsubscribe`, {
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
			if (res.status === 200) messenger.sendTextMessage(id, `You have been successfully unsubscribed from ${name}.`)
			else messenger.sendTextMessage(id, "An error occured in your subscription, please try again later.")
		})
		.catch(err => {
			console.log(err)
			messenger.sendTextMessage(id, "An error occured in your subscription, please try again later.")
		})
	}

}



