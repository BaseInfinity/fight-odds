export {};

const { REST, Routes } = require('discord.js');
const { clientId, guildId, discordToken } = require('./config.json');
const fs = require('node:fs');

const commands = [];
const commandFiles = fs.readdirSync('./commands').filter((file: string) => file.endsWith('.ts'));

for (const file of commandFiles) {
   const command = require(`./commands/${file}`);
   commands.push(command.data.toJSON());
}

const rest = new REST({ version: '10' }).setToken(discordToken);

// Deploy the commands
(async () => {
   try {
      console.log(`Started refreshing ${commands.length} application (/) commands.`);

      // The put method is used to fully refresh all commands in the guild with the current set
      const data = await rest.put(
         Routes.applicationGuildCommands(clientId, guildId),
         { body: commands },
      );

      console.log(`Successfully reloaded ${data.length} application (/) commands.`);
   } catch (error) {
      // And of course, make sure you catch and log any errors!
      console.error(error);
   }
})();