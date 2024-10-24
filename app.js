import 'dotenv/config';
import express from 'express';
import { getRandomEmoji, monitorNBAGames } from './utils.js';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const Discord = require('discord.js');
const client = new Discord.Client({ intents: [Discord.GatewayIntentBits.Guilds, Discord.GatewayIntentBits.GuildMessages, Discord.GatewayIntentBits.MessageContent] });


// Create an express app
const app = express();
// Get port, or default to 3000
const PORT = process.env.PORT || 3000;

var dazProtect = false;
client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('messageCreate', (message) => {
  if (message.author.bot) return; // Ignore messages from bots
  if(message.content == '!startMonitoringNBAGames' && dazProtect == false){
    dazProtect = true;
    message.channel.send("BEGINNING TO MONITOR")
    let already_pinged = []
    setInterval(() => monitorNBAGames(message, already_pinged), 80000);
  }
});

//client.login(token);