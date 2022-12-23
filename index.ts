const fs = require('node:fs');
const path = require('node:path');

const { Client, Collection, Events, GatewayIntentBits } = require('discord.js');
const { discordToken } = require('./config.json');

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.commands = new Collection();


// Dynamically load all command files
// Boilerplate schtuff, not worth DRYing up IMO
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter((file: string) => file.endsWith('.ts'));

for (const file of commandFiles) {
   const filePath = path.join(commandsPath, file);
   const command = require(filePath);
   // Set a new item in the Collection with the key as the command name and the value as the exported module
   if ('data' in command && 'execute' in command) {
      client.commands.set(command.data.name, command);
   }
   else {
      console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
   }
}

// Dynamically load all event files
// Boilerplate schtuff, not worth DRYing up IMO
const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs.readdirSync(eventsPath).filter((file: string) => file.endsWith('.ts'));

for (const file of eventFiles) {
   const filePath = path.join(eventsPath, file);
   const event = require(filePath);
   if (event.once) {
      client.once(event.name, (...args: any) => event.execute(...args));
   }
   else {
      client.on(event.name, (...args: any) => event.execute(...args));
   }
}

client.once(Events.ClientReady, (c: { user: { tag: any; }; }) => {
   console.log(`Ready! Logged in as ${c.user.tag}`);
});

client.login(discordToken);