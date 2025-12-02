import { Client, Collection, GatewayIntentBits, Partials } from 'discord.js';
import { Player } from 'discord-player';
import { YoutubeiExtractor } from 'discord-player-youtubei';
import { readdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.GuildMessageReactions,
  ],
  partials: [Partials.Message, Partials.Channel, Partials.Reaction],
});

client.commands = new Collection();
client.cooldowns = new Collection();

const player = new Player(client, {
  ytdlOptions: {
    quality: 'highestaudio',
    highWaterMark: 1 << 25,
  },
});

await player.extractors.register(YoutubeiExtractor, {
  overrideBridgeMode: 'yt',
  streamOptions: {
    useClient: 'IOS',
  },
});
await player.extractors.loadDefault((ext) => ext !== 'YouTubeExtractor');
console.log('Music extractors loaded successfully');
client.player = player;

async function loadCommands() {
  const commandFolders = readdirSync(join(__dirname, 'commands'));
  
  for (const folder of commandFolders) {
    const commandFiles = readdirSync(join(__dirname, 'commands', folder)).filter(file => file.endsWith('.js'));
    
    for (const file of commandFiles) {
      const command = await import(`./commands/${folder}/${file}`);
      if (command.default?.data && command.default?.execute) {
        client.commands.set(command.default.data.name, command.default);
        console.log(`Loaded command: ${command.default.data.name}`);
      }
    }
  }
}

async function loadEvents() {
  const eventFiles = readdirSync(join(__dirname, 'events')).filter(file => file.endsWith('.js'));
  
  for (const file of eventFiles) {
    const event = await import(`./events/${file}`);
    if (event.default?.once) {
      client.once(event.default.name, (...args) => event.default.execute(...args, client));
    } else if (event.default?.name) {
      client.on(event.default.name, (...args) => event.default.execute(...args, client));
    }
  }
}

player.events.on('playerStart', (queue, track) => {
  queue.metadata.channel.send(`🎵 Now playing: **${track.title}** by ${track.author}`);
});

player.events.on('audioTrackAdd', (queue, track) => {
  queue.metadata.channel.send(`✅ Added to queue: **${track.title}**`);
});

player.events.on('emptyQueue', (queue) => {
  queue.metadata.channel.send('✅ Queue finished! No more songs to play.');
});

player.events.on('error', (queue, error) => {
  console.error(`Player error: ${error.message}`);
});

async function main() {
  try {
    await loadCommands();
    await loadEvents();
    
    const token = process.env.DISCORD_TOKEN;
    if (!token) {
      console.error('ERROR: DISCORD_TOKEN is not set in environment variables!');
      console.log('Please set your Discord bot token as DISCORD_TOKEN in your environment.');
      process.exit(1);
    }
    
    await client.login(token);
  } catch (error) {
    console.error('Failed to start bot:', error);
    process.exit(1);
  }
}

main();
