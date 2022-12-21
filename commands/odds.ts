const { SlashCommandBuilder } = require('discord.js');
const axios = require ('axios')
const { b365Token } = require('../config.json');

import MatchUp from '../src/matchUp';
import Competitor from '../src/competitor';


let cachedEvents: any[]

module.exports = {
   data: new SlashCommandBuilder()
      .setName('odds')
      .setDescription('Replies with betting odds')
      .addStringOption((option: { setName: (arg0: string) => { (): any; new(): any; setDescription: { (arg0: string): { (): any; new(): any; setAutocomplete: { (arg0: boolean): { (): any; new(): any; setRequired: { (arg0: boolean): any; new(): any; }; }; new(): any; }; }; new(): any; }; }; }) => 
         option.setName('matchup')
            .setDescription('Search for a Competitor in the matchup to find odds for')
            .setAutocomplete(true)
            .setRequired(true)),
   async execute(interaction: { options: { getString: (arg0: string) => any; }; reply: (arg0: string) => void; }) {
      console.log(interaction.options)
      const matchup = JSON.parse(interaction.options.getString('matchup'))
      console.log('matchup')
      console.log(matchup)

        // Prevoius request finds the matchups, this request finds the odds for the match
        axios.get(`https://api.b365api.com/v2/event/odds?token=${b365Token}&event_id=${matchup.eventId}`)
           .then(function(oddsResponse: { data: { results: { odds: { [x: string]: any[]; }; }; }; }) {
            var latestOdds = oddsResponse.data.results.odds['9_1'][0];
            console.log('latest odds')
            console.log(latestOdds)

            const matchUp = new MatchUp(
                new Competitor(matchup.homeName, latestOdds.home_od),
                new Competitor(matchup.awayName, latestOdds.away_od),
            )

            console.log(matchUp)
            console.log(matchUp.getSummary())

            interaction.reply(matchUp.getSummary())
        });
   },
   async autocomplete(interaction: any) {
      console.log('interaction happened for auto complete')
      const focusedValue = interaction.options.getFocused();

      if (!cachedEvents) {
         axios.get(`https://api.b365api.com/v3/events/upcoming?sport_id=9&token=${b365Token}`)
            .then(async function (eventsResponse: { data: { results: any[]; }; }) {

               const choices = eventsResponse.data.results.filter(choice => choice.league.name === 'Boxing');


               // ADD CHECK FOR AWAY
               const filtered = choices.filter(choice => {
                  return choice.home.name.toLowerCase().includes(focusedValue.toLowerCase()) || choice.away.name.toLowerCase().includes(focusedValue.toLowerCase())
               });

               console.log('not using cached events')

               cachedEvents = choices

               await interaction.respond(
                  filtered.map(choice => ({ name: `${choice.home.name} Vs. ${choice.away.name}`, value: JSON.stringify({ homeName: choice.home.name, awayName: choice.away.name, eventId: choice.id}) })),
               );
            });
      } else {
         const choices = cachedEvents

         const filtered = choices.filter(choice => {
            return choice.home.name.toLowerCase().includes(focusedValue.toLowerCase()) || choice.away.name.toLowerCase().includes(focusedValue.toLowerCase())
         });

         await interaction.respond(
            filtered.map(choice => ({ name: `${choice.home.name} Vs. ${choice.away.name}`, value: JSON.stringify({ homeName: choice.home.name, awayName: choice.away.name, eventId: choice.id }) })),
         );
      }
   }
};