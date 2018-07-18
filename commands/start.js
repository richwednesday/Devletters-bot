const FBMessenger = require('../ui/messenger')
const messenger = new FBMessenger(process.env.FB_PAGE_TOKEN)
const session = require('../boombot/session')

module.exports = function(id, skipp) {
  if (skipp) return start(id)

  messenger.getProfile(id, (err, res) => {
    if (err) res = {first_name: ""}

    messenger.sendTextMessage(id, "Welcome to DevLetters " + res.first_name + ". I am Toby, and I can keep you updated with " + 
      "information in your favorite developer community.", () => {
        
      start(id)
    })
    session.setState(id, "Step 1")
  })
}

function start(id) {
  messenger.sendTextMessage(id, "Please select from the communities below", () => {
    messenger.sendHScrollMessage(id, elements, () => {
      setTimeout(() => {
        messenger.sendQuickRepliesMessage(id, "or send your location to search with your location.", [{content_type: "location"}])
      }, 7000)
    })
  })
}

let elements = [
  {
    title: "Facebook Developer Circles",
    subtitle: "Connecting communities to develop the future.",
    image_url: "https://static.xx.fbcdn.net/rsrc.php/v3/yV/r/BhqIEprNoBN.png",
    buttons: [ {
      type: "postback",
      title: "Select",
      payload: "Community/01/Facebook Developer Circles"
    }]
  },
  {
    title: "Forloop",
    subtitle: "A community of passionate software developers and enthusiasts across Africa.",
    image_url: "https://i2.wp.com/digestafrica.com/wp-content/uploads/2017/11/forLoop-Kampala.jpg?fit=960%2C960",
    buttons: [ {
      type: "postback",
      title: "Select",
      payload: "Community/02/Forloop"
    }]
  },
  {
    title: "Google Developer Groups",
    subtitle: "GDGs are local groups of developers who are specifically interested in Google products and APIs.",
    image_url: "https://lh3.googleusercontent.com/06LV2EzhXpzrtREoQVZjzZqyuhMoTN7gcIvJRZ40GGHF-BLqkCsvOzrvrS0rOkH_aov7SJJUbK23AOHSqzXYTKeoO3iw29s=s688",
    buttons: [ {
      type: "postback",
      title: "Select",
      payload: "Community/03/Google Developer Groups"
    }]
  },
  {
    title: "FreeCodeCamp Study Groups",
    subtitle: "Code together with other people in your city.",
    image_url: 'https://cdn-images-1.medium.com/max/630/1*eDaRLwBlwmjCpkeeqRM4vw.png',
    buttons: [ {
      type: "postback",
      title: "Select",
      payload: "Community/04/FreeCodeCamp Study Groups"
    }]
  },
  {
    title: "AI Saturdays",
    subtitle: "Empowering you to learn AI through structured study groups.",
    image_url: 'https://nurture.ai/statics/aisaturdays/img/logo-large.jpg',
    buttons: [ {
      type: "postback",
      title: "Select",
      payload: "Community/05/AI Saturdays"
    }]
  }
]