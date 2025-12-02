import { REST, Routes } from 'discord.js';
import { readdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const commands = [];

async function loadCommands() {
  const commandFolders = readdirSync(join(__dirname, 'commands'));
  
  for (const folder of commandFolders) {
    const commandFiles = readdirSync(join(__dirname, 'commands', folder)).filter(file => file.endsWith('.js'));
    
    for (const file of commandFiles) {
      const command = await import(`./commands/${folder}/${file}`);
      if (command.default?.data) {
        commands.push(command.default.data.toJSON());
        console.log(`Loaded command for deployment: ${command.default.data.name}`);
      }
    }
  }
}

async function deployCommands() {
  await loadCommands();
  
  const token = process.env.DISCORD_TOKEN;
  const clientId = process.env.CLIENT_ID;
  
  if (!token || !clientId) {
    console.error('ERROR: DISCORD_TOKEN and CLIENT_ID must be set!');
    process.exit(1);
  }
  
  const rest = new REST({ version: '10' }).setToken(token);
  
  try {
    console.log(`Started refreshing ${commands.length} application (/) commands.`);
    
    const data = await rest.put(
      Routes.applicationCommands(clientId),
      { body: commands },
    );
    
    console.log(`Successfully reloaded ${data.length} application (/) commands.`);
  } catch (error) {
    console.error('Error deploying commands:', error);
  }
}

deployCommands();
