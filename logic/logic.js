const axios = require('axios');
const moment = require('moment')

class Logic {
  similarity(s1, s2) {
    var longer = s1;
    var shorter = s2;
    if (s1.length < s2.length) {
      longer = s2;
      shorter = s1;
    }
    var longerLength = longer.length;
    if (longerLength == 0) {
      return 1.0;
    }
    return (longerLength - this.editDistance(longer, shorter)) / parseFloat(longerLength);
  }

  editDistance(s1, s2) {
    s1 = s1.toLowerCase();
    s2 = s2.toLowerCase();
  
    var costs = new Array();
    for (var i = 0; i <= s1.length; i++) {
      var lastValue = i;
      for (var j = 0; j <= s2.length; j++) {
        if (i == 0)
          costs[j] = j;
        else {
          if (j > 0) {
            var newValue = costs[j - 1];
            if (s1.charAt(i - 1) != s2.charAt(j - 1))
              newValue = Math.min(Math.min(newValue, lastValue),
                costs[j]) + 1;
            costs[j - 1] = lastValue;
            lastValue = newValue;
          }
        }
      }
      if (i > 0)
        costs[s2.length] = lastValue;
    }
    return costs[s2.length];
  }

  fetchData(id) {
    return axios({
      method: 'get',
      url: `https://api.football-data.org/v2/teams/${id}/matches`,
      headers: {
        'Content-Type': 'application/json',
        'X-Auth-Token': 'bce19fcd8555454f88cc030aa3dd5c09'
      }
    })
    .then(res => {
      const {matches} = res.data
      const nextMatches = matches.filter(item => moment.utc(item.utcDate).diff(currentDate, 'days') > 0);
      const nextMatch = nextMatches[0]
      return `The next match is ${nextMatch.homeTeam.name} vs ${nextMatch.awayTeam.name} on ${moment.utc(nextMatch.utcDate).format('LLLL')}, good luck!`
    })
    .catch(err => {
      return 'Sorry, I was not able to find the upcoming matches!'
    })
  }
}

module.exports = Logic;
