const commands = require('../commands/commands') 
const PostbackFilter = require('./postback_dispatch').PostbackFilter

const FBMessenger = require('../ui/messenger')
const messenger = new FBMessenger(process.env.FB_PAGE_TOKEN)

const session = require('./session')

let saying_yes = ["yes", "yea", "yup", "ya", "yep", "sure", "you bet", "for sure", "sure thing", "certainly", "definitely", "yeah", 
  "yh", "absolutely", "totally", "totes", "yes please", "of course", "gladly", "indubitably", "indeed", "undoubtedly", "aye"]
let saying_no = ["no", "nope", "naa", "nah", "neh", "nay", "at all", "not at all", "negative", "Uhn Uhn", "no way", "nop"]

function defaultText(id, message) {
  console.log("default text")
}

function attachmentsHandler(id, attachments, state) {
  if (attachments[0].payload.coordinates) {
    let coordinates = attachments[0].payload.coordinates
    commands.search(id, "Location as Coordinates", [coordinates.lat, coordinates.long, state])
  } 
  else defaultText(id)
} 

function messageTextHandler(id, message, state) {
  if (message.toLowerCase() === "get started") commands.start(id)
  
  else if (state === "Step 1" || /^Community/.test(state)) commands.search(id, "Location as Text", [message, state])
  else if (/^ASKSubscribe/.test(state)) {
    if (saying_yes.includes(message)) commands.subscription(id, "ASKSubscribe", `${state}/1`)
    else if (saying_yes.includes(message)) commands.subscription(id, "ASKSubscribe", `${state}/0`)
    else {
      messenger.sendTextMessage(id, "If in doubt, the answer is no :)")
      session.setState(id, "Clear")
    }
  }

  else defaultText(id, message)
}

// Routing for messages
function MessageDispatch(event) {
	const senderID = event.sender.id
  const message = event.message

  console.log(message)

  // You may get a text, attachment, or quick replies but not all three
  let messageText = message.text;
  let messageAttachments = message.attachments;
  let quickReply = message.quick_reply;
  
  // Quick Replies contain a payload so we take it to the Postback
  if (quickReply) {
    PostbackFilter(senderID, quickReply.payload);
  }

  else if (messageAttachments) {
    session.getState(senderID, (state) => {
      attachmentsHandler(senderID, messageAttachments, state);
    })
  } 
  
  else if (messageText) {
    session.getState(senderID, (state) => {
      messageTextHandler(senderID, messageText, state);
    })
  }
}

module.exports = MessageDispatch