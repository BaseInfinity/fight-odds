const axios = require ('axios')
const { b365Token } = require('./config.json');

import MatchUp from './src/matchUp';
import Competitor from './src/competitor';

axios.get(`https://api.b365api.com/v3/events/upcoming?sport_id=9&token=${b365Token}`)
    .then(function (eventsResponse: { data: { results: any[]; }; }) {
        var competitorName = 'Anthony Yarde';
        const foundMatch = eventsResponse.data.results.find(sportingEvent => sportingEvent.home.name === competitorName || sportingEvent.away.name === competitorName);
        console.log('found match')
        console.log(foundMatch)

        // Prevoius request finds the matchups, this request finds the odds for the match
        axios.get(`https://api.b365api.com/v2/event/odds?token=${b365Token}&event_id=${foundMatch.id}`)
           .then(function(oddsResponse: { data: { results: { odds: { [x: string]: any[]; }; }; }; }) {
            var latestOdds = oddsResponse.data.results.odds['9_1'][0];
            console.log('latest odds')
            console.log(latestOdds)

            const matchUp = new MatchUp(
                new Competitor(foundMatch.home.name, latestOdds.home_od),
                new Competitor(foundMatch.away.name, latestOdds.away_od),
            )

            console.log(matchUp)
            console.log(matchUp.getSummary())

        });
    }).catch(function (error: any): void {
        console.log(error);
    });