const fetch = require('node-fetch')
const session = require('../boombot/session')

const FBMessenger = require('../ui/messenger')
const messenger = new FBMessenger(process.env.FB_PAGE_TOKEN)

module.exports = function(event) {
  console.log(event)

  let groupId = event.referral.ref
  let id = event.sender.id
  
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
    if (res.status !== 200) {
      messenger.sendTextMessage(id, "An error occured in your subscription, please try again later.")
      return null
    }
    else return res.json()
  })
  .then(group => {
    if (group) {
      if (group.name && group.image_url) {
        messenger.sendImageMessage(id, group.image_url, () => 
          messenger.sendTextMessage(id, `You have been successfully subscribed to receive community updates from ${group.name}. 🤗`, () => {
          
            let elements = [{
              "content_type": "text",
              "title": "Yes",
              "payload": 'Search Community'
            }, {
              "content_type": "text",
              "title": 'Not at the moment',
              "payload": 'Dont Search'
            }]
            messenger.sendQuickRepliesMessage(id, "Would you like to explore other communities?", elements)
            session.setState(id, "Step 1a")
          }
        ))    
      }
      else messenger.sendTextMessage(id, "You have been successfully subscribed to this group.")
    }
  })
  .catch(err => {
    console.log(err)
    messenger.sendTextMessage(id, "An error occured in your subscription, please try again later.")
  })
}