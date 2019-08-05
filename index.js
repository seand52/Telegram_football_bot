require("dotenv").config();
const bot = require("./config/telegram_config");
const Logic = require("./logic/logic");
const services = new Logic();
const teams = require("./teams");

bot.onText(/\/nextmatch (.+)/, (msg, match) => {
  const numberofGames = 1
  const requestedTeam = match[1];
  const teamData = teams.find(item => item.team === requestedTeam);
  if (!teamData) {
    const possibleTeams = teams.filter(item => services.similarity(item.team, requestedTeam) > 0.4).map(team => team.team)
    bot.sendMessage(msg.chat.id, `Sorry, the team you asked for doesn't match our database. Based on what you asked for the closes teams we found are these: \n-${possibleTeams.join('\n-')}\n Please try again with one of these teams or look at our about section to find if we support the team you're looking for.`)
    return
  }
  services.fetchData(teamData.id, numberofGames).then(response => {
    bot.sendMessage(msg.chat.id, response);
  });
});

bot.onText(/\d+/, (msg, match) => {
  const requestedTeam = msg.text.substr(msg.text.indexOf(' ')+1)
  const numberofGames = msg.text.substr(0,msg.text.indexOf(' ')).match(/nextmatch(\d+)/)[1]
  const teamData = teams.find(item => item.team === requestedTeam);
  if (!teamData) {
    const possibleTeams = teams.filter(item => services.similarity(item.team, requestedTeam) > 0.4).map(team => team.team)
    bot.sendMessage(msg.chat.id, `Sorry, the team you asked for doesn't match our database. Based on what you asked for the closes teams we found are these: \n-${possibleTeams.join('\n-')}\n Please try again with one of these teams or look at our about section to find if we support the team you're looking for.`)
    return
  }

  services.fetchData(teamData.id, numberofGames).then(response => {
    bot.sendMessage(msg.chat.id, response);
  });
})

