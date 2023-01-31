export {};
const { Events } = require('discord.js');

module.exports = {
   name: Events.InteractionCreate,

   async execute(interaction: any) {
      const command = interaction.client.commands.get(interaction.commandName);

      if (!command) {
         console.error(`No command matching ${interaction.commandName} was found.`);
         return;
      }

      try {
         if (interaction.isChatInputCommand()) {
            await command.execute(interaction);
         } else if (interaction.isAutocomplete()) {
            await command.autocomplete(interaction);
         }
      } catch (error) {
         console.error(`Error executing ${interaction.commandName}`);
         console.error(error);
      }
   },
};