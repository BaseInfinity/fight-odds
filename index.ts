const fs = require('node:fs');
const path = require('node:path');
// Require the necessary discord.js classes
const { Client, Collection, Events, GatewayIntentBits } = require('discord.js');
const { discordToken } = require('./config.json');

// Create a new client instance
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.commands = new Collection();

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


// When the client is ready, run this code (only once)
// We use 'c' for the event parameter to keep it separate from the already defined 'client'
client.once(Events.ClientReady, (c: { user: { tag: any; }; }) => {
   console.log(`Ready! Logged in as ${c.user.tag}`);
});

// Log in to Discord with your client's token
client.login(discordToken);