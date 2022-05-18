const slackbot = require('slackbots')

const bot = new slackbot({
    token: process.env.SLACKBOT_TOKEN,
    name: 'SERVER BOT'
})

function getCurrentTime () {
    const options = {
      hour12: false,
      timeZone: 'Europe/Stockholm'
    }
    return new Date().toLocaleTimeString('sv-SV', options)
  }

module.exports = {
  startup () {
    bot.on('start', function () {
      const message = getCurrentTime() + ' Startar...'
      bot.postMessage('servers', message).then(function (data) {
        console.log('Slackbot startad utan problem.')
      })
        .fail(function (error) {
          console.log(error)
        })
    })
  },
  sendMessage (message) {
    message = getCurrentTime() + ' ' + message
    bot.postMessage('servers', message).then(function (data) {
      console.log('Slackbot: meddelande skickat.')
    })
      .fail(function (error) {
        console.log(error)
      })
  }
}