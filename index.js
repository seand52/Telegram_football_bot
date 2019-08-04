require("dotenv").config();
const bot = require("./config/telegram_config");
const Logic = require("./logic/logic");
const services = new Logic();
const moment = require('moment');
const axios = require("axios");
const teams = require("./teams");

bot.onText(/\/nextmatch (.+)/, (msg, match) => {
  const requestedTeam = match[1]
  const teamData = teams.find(item => item.team === requestedTeam);
  const currentDate = moment()
  axios({
    method: 'get',
    url: `https://api.football-data.org/v2/teams/${teamData.id}/matches`,
    headers: {
      'Content-Type': 'application/json',
      'X-Auth-Token': 'bce19fcd8555454f88cc030aa3dd5c09'
    }
  })
  .then(res => {
    const {matches} = res.data
    const nextMatches = matches.filter(item => moment.utc(item.utcDate).diff(currentDate, 'days') > 0);
    const nextMatch = nextMatches[0]
    bot.sendMessage(msg.chat.id, `The next match is ${nextMatch.homeTeam.name} vs ${nextMatch.awayTeam.name} on ${moment.utc(nextMatch.utcDate).format('LLLL')}, good luck!`);
  })
  .catch(err => {
    bot.sendMessage(msg.chat.id, 'Sorry, I was not able to find the upcoming matches!');
  })
  
});

bot.on("callback_query", callbackQuery => {});
