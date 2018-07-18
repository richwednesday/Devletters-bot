const FBMessenger = require('../ui/messenger')
const messenger = new FBMessenger(process.env.FB_PAGE_TOKEN)
const session = require('../boombot/session')

const fetch = require('node-fetch');

function main(id, payload, details) {
  if (payload === "Community") {
    let name = details.split('/')[2]
    messenger.sendQuickRepliesMessage(id, `Please send your location or type your city to search for ${name} around you.`, [{content_type: "location"}])
    session.setState(id, details)  
  }

  else if (payload === "Location as Text") {
    fetch(`https://maps.google.com/maps/api/geocode/json?address=${details[0]}&key=${process.env.MAPS_KEY}`)
      .then(res => res.json())
      .then(json => {
        console.log(json)
        if (!json.results.length) 
          messenger.sendTextMessage(id, "Sorry I could not get that. Can you try typing the province or state that location is in.")

        let geo = json.results[0].geometry.location
        console.log(geo)

        main(id, "Location as Coordinates", [geo.lat, geo.lng, details[1]]) 
      })
  }

  else if (payload === "Location as Coordinates") {
    let community_id = details[2] ? details[2].split('/')[1] : null
    fetch(`${process.env.CORE_URL}/groups/location?geo=${details[0]},${details[1]}&community_id=${community_id}&masterKey=${process.env.CORE_API_KEY}`)
      .then(res => res.json())
      .then(json => {
        console.log(json)
        if (!json.length) messenger.sendTextMessage(id, "Sorry I could not find communities around you.", () => {
          messenger.sendTextMessage(id, "You can visit my website here http://waitingforsambwa.com to contribute.")
        })

        else if (json.length === 1) sendGroup(id, json[0])
        else sendFoundGroups(id, json)
      })
      .catch(err => {
        console.log(err)
      })
  }

  else if (payload === "Group") {
    let split = details.split('||')
    console.log(split)
    let group = {
      id: split[0],
      image_url: split[1],
      description: split[2]
    }
    sendGroup(id, group)
  }
}

function sendGroup(id, group) {
  messenger.sendImageMessage(id, group.image_url, () => {
    messenger.sendTextMessage(id, group.description, () => {

      setTimeout(() => {
        let elements = [{
          "content_type": "text",
          "title": "Yes",
          "payload": `ASKSubscribe/${group.id}/1`
        }, {
          "content_type": "text",
          "title": "No",
          "payload": `ASKSubscribe/${group.id}/0`
        }]

        messenger.sendQuickRepliesMessage(id, "Do you want to subscribe to updates from this community?\n\nYou can change " +
          "your subscriptions by typing 'settings'", elements)
      }, group.description.length * 19)
      
      session.setState(id, `ASKSubscribe/${group.id}`)
    })
  })
}

function sendFoundGroups(id, groups) {
  let elements = []
  for (let group of groups) {
    elements.push({
      title: group.name,
      subtitle: group.description,
      image_url: group.image_url,
      buttons: [{
        type: "postback",
        title: "Select",
        payload: `Group||${group.id}||${group.image_url}||${group.description}`
      }]
    })
    if (elements.length === 9) break;
  }

  messenger.sendTextMessage(id, "These are the communities near you, Click the 'select' button for more info.", () => {
    messenger.sendHScrollMessage(id, elements)
  })
}

module.exports = main