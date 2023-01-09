const { SlashCommandBuilder } = require('discord.js');
const axios = require ('axios')
const { b365Token } = require('../config.json');

const NodeCache = require( "node-cache" );
const myCache = new NodeCache();

import MatchUp from '../src/matchUp';
import Competitor from '../src/competitor';

module.exports = {
   data: new SlashCommandBuilder()
      .setName('odds')
      .setDescription('Replies with betting odds')
      .addStringOption((option: any) =>
         option.setName('matchup')
            .setDescription('Search for a Competitor in the matchup to find odds for')
            .setAutocomplete(true)
            .setRequired(true)),

   async execute(interaction: any) {
      const matchup = JSON.parse(interaction.options.getString('matchup'))

        // Find the odds for given matchup/event
      axios.get(`https://api.b365api.com/v2/event/odds?token=${b365Token}&event_id=${matchup.eventId}`)
         .then(function(oddsResponse: any) {
            const allOdds = oddsResponse.data.results.odds['9_1'];

            // Simple sort to make sure we always return the latest odds for an event as they change over time
            const latestOdds = allOdds.sort((a: any, b: any) => b.add_time - a.add_time)[0]

            const matchUp = new MatchUp(
               new Competitor(matchup.homeName, latestOdds.home_od),
               new Competitor(matchup.awayName, latestOdds.away_od),
            )

            interaction.reply(matchUp.getSummary())
         });
   },
   async autocomplete(interaction: any) {
      const focusedValue = interaction.options.getFocused();

      const cachedEvents = myCache.get('matchups')

      const ufcEmoji = '👊'
      const boxingEmoji = '🥊'

      // Cache miss, lets make an API request
      if (cachedEvents === undefined) {
         axios.get(`https://api.b365api.com/v3/events/inplay?sport_id=9&token=${b365Token}`)

            .then(async function (eventsResponse: { data: { results: any[]; }; }) {
               let choices = eventsResponse.data.results.sort((a, b) => a.time - b.time);

               console.log('inplay choices')
               console.log(choices)

               axios.get(`https://api.b365api.com/v3/events/upcoming?sport_id=9&token=${b365Token}`)
                  .then(async function (eventsResponse: { data: { results: any[]; }; }) {

                     choices = choices.concat(eventsResponse.data.results.sort((a, b) => a.time - b.time));

                     console.log('upcoming choices')
                     console.log(choices)

                     // This filter logic is similar to below but IMO not worth DRYing up unless we need to get
                     // smarter with filtering
                     let filtered = choices.filter(choice => {
                        return choice.home.name.toLowerCase().includes(focusedValue.toLowerCase()) ||
                           choice.away.name.toLowerCase().includes(focusedValue.toLowerCase())
                     });

                     myCache.set('matchups', choices, 86400);

                     if (filtered.length > 25) {
                        // Hack until I add another option to separate Boxing/UFC results
                        filtered = filtered.slice(0, 25)
                     }

                     // This logic is similar to getSummary, might be worth throwing this into Matchup class
                     await interaction.respond(
                        filtered.map(choice => ({
                           name: `${choice.home.name} Vs. ${choice.away.name} ${choice.league.name === "Boxing" ? boxingEmoji : ufcEmoji}`,
                           value: JSON.stringify({ homeName: choice.home.name, awayName: choice.away.name, eventId: choice.id })
                        }))
                     );
                  });

            });

      } else {
         const choices = cachedEvents

         let filtered = choices.filter((choice: any) => {
            return choice.home.name.toLowerCase().includes(focusedValue.toLowerCase()) ||
               choice.away.name.toLowerCase().includes(focusedValue.toLowerCase())
         });

         if (filtered.length > 25) {
            // Hack until I add another option to separate Boxing/UFC results
            filtered = filtered.slice(0, 25)
         }

         await interaction.respond(
            filtered.map((choice: any) => ({
               name: `${choice.home.name} Vs. ${choice.away.name} ${ choice.league.name === "Boxing" ? boxingEmoji : ufcEmoji}`,
               value: JSON.stringify({ homeName: choice.home.name, awayName: choice.away.name, eventId: choice.id})
            }))
         );
      }
   }
};