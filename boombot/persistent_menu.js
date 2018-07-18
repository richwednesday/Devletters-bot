const FBMessenger = require('../ui/messenger')
const messenger = new FBMessenger(process.env.FB_PAGE_TOKEN)

// Enables persistent menu for your bot
PersistentMenu = {
  enable() {
  	// Design your persistent menu here:
  	messenger.setMessengerProfile({
      persistent_menu: [
        {
          locale: 'default',
          composer_input_disabled: false,
          call_to_actions: [
            {
              type: 'postback',
              title: 'Search Communities',
              payload: 'Search Community'
            },
            {
              type: 'postback',
              title: 'Manage Subscriptions/Messages',
              payload: 'Manage Subscription'
            },
            {
              type: 'postback',
              title: '🔦 Feedback/Contact Makers',
              payload: 'Feedback'
            }
          ]
        }
      ]
    })
  }
}

module.exports = PersistentMenu
