import 'dotenv/config';
import { createRequire } from 'module';
import {
  InteractionType,
  InteractionResponseType,
  verifyKeyMiddleware,
} from 'discord-interactions';
const require = createRequire(import.meta.url);

export async function DiscordRequest(endpoint, options) {
  // append endpoint to root API URL
  const url = 'https://discord.com/api/v10/' + endpoint;
  // Stringify payloads
  if (options.body) options.body = JSON.stringify(options.body);
  // Use fetch to make requests
  const res = await fetch(url, {
    headers: {
      Authorization: `Bot ${process.env.DISCORD_TOKEN}`,
      'Content-Type': 'application/json; charset=UTF-8',
      'User-Agent': 'DiscordBot (https://github.com/discord/discord-example-app, 1.0.0)',
    },
    ...options
  });
  // throw API errors
  if (!res.ok) {
    const data = await res.json();
    console.log(res.status);
    throw new Error(JSON.stringify(data));
  }
  // return original response
  return res;
}

export async function InstallGlobalCommands(appId, commands) {
  // API endpoint to overwrite global commands
  const endpoint = `applications/${appId}/commands`;

  try {
    // This is calling the bulk overwrite endpoint: https://discord.com/developers/docs/interactions/application-commands#bulk-overwrite-global-application-commands
    await DiscordRequest(endpoint, { method: 'PUT', body: commands });
  } catch (err) {
    console.error(err);
  }
}

// Simple method that returns a random emoji from list
export function getRandomEmoji() {
  const emojiList = ['😭','😄','😌','🤓','😎','😤','🤖','😶‍🌫️','🌏','📸','💿','👋','🌊','✨'];
  return emojiList[Math.floor(Math.random() * emojiList.length)];
}

export function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function sleep(milliseconds) {
  var start = new Date().getTime();
  for (var i = 0; i < 1e7; i++) {
    if ((new Date().getTime() - start) > milliseconds){
      break;
    }
  }
}

export function monitorNBAGames(message, already_pinged){

  var curDate = new Date();
  let dateToPass = (curDate.getFullYear())+ '-' + ('0' + (curDate.getMonth()+1)).slice(-2) + '-' + ('0' + (curDate.getDate())).slice(-2);
  console.log(dateToPass);
  const url = "https://api.balldontlie.io/v1/games?start_date="+dateToPass+"&end_date="+dateToPass;
  const options = {
    headers: {
      Authorization: "0241eab9-252e-457b-8f3a-e8e780f673d9",
      method: 'GET'
    }
  };
  console.log(already_pinged);
  fetch(url, options).then(res => res.json()).then(data=> {
      let i = 0;
      do {
        let currentGameTime = data["data"][i]["time"];
        let currentHomeTeamScore = data["data"][i]["home_team_score"];
        let currentVisitorTeamScore = data["data"][i]["visitor_team_score"];
         if(currentGameTime != null && !already_pinged.includes(data["data"][i]["home_team"]["full_name"])){
           var n = currentGameTime.lastIndexOf(':');
           var substringTime = currentGameTime.substring(n-2);
           const [minutes, seconds] = substringTime.split(":").map(Number);
           var quarter = currentGameTime.charAt(1);
           console.log(data["data"][i]);
           console.log(minutes + " " + seconds + " " + quarter);
           if(minutes < 5 && quarter == 4){
             console.log("LATE GAME DETECTED");
             if(Math.abs(currentHomeTeamScore - currentVisitorTeamScore) <= 5){
              console.log("CRUNCH TIME DETECTED!!!");
               console.log(data["data"][i]);
               message.channel.send(`<@&966858270004371576>` + " game between: " + data["data"][i]["home_team"]["full_name"] + " and " + data["data"][i]["visitor_team"]["full_name"] + " is close in the last 5 minutes!");
               already_pinged.push(data["data"][i]["home_team"]["full_name"]);
             }
           } 
         }
        i++;
      } while(i < data["data"].length);
    }
  );

  return already_pinged;


}