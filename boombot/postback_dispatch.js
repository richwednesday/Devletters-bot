const commands = require('../commands/commands') 
const referrals = require('./referral_dispatch')

// Routing for postbacks
function PostbackDispatch(event) {
	let senderID = event.sender.id
	let payload = event.postback.payload
	let referral = event.postback.referral

  if (referral) {
		event.referral = event.postback.referral
		referrals(event)
	}
	else PostbackFilter(senderID, payload)
}

function PostbackFilter(id, payload) {
	if (/^Community/.test(payload)) commands.search(id, "Community", payload)
	else if (/^ASKSubscribe/.test(payload)) commands.subscription(id, "ASKSubscribe", payload)
	else if (/^Group/.test(payload)) commands.search(id, "Group", payload)
	else if (/^Unsubscribe/.test(payload)) commands.subscription(id, "Unsubscribe", payload)

	else if (payload === 'Start') commands.start(id)
	else if (payload === 'Search Community') commands.start(id, "start")
	else if (payload === 'Dont Search') commands.start(id, "nope")
	else if (payload === 'Manage Subscription') commands.subscription(id, "Manage")
	else if (payload === 'Feedback') commands.feedback(id, "Ask Feedback")

	else console.log(`payload ${payload} not from me`)
}

module.exports = {
	PostbackDispatch,
	PostbackFilter
}