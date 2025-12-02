# Discord All-Rounder Bot

A comprehensive Discord bot with server management, music playback, custom currency/game system, leaderboards, count games, and ticket support.

## Features

### Server Management
- `/kick` - Kick members from the server
- `/ban` - Ban members from the server
- `/mute` - Timeout members
- `/unmute` - Remove timeout from members
- `/clear` - Bulk delete messages
- `/role add/remove` - Manage user roles

### Music System
- `/play` - Play songs from YouTube by URL or search
- `/skip` - Skip current song
- `/stop` - Stop music and clear queue
- `/pause` - Pause playback
- `/resume` - Resume playback
- `/queue` - View music queue
- `/shuffle` - Shuffle the queue
- `/nowplaying` - Show current song
- `/volume` - Set volume (0-100)

### Economy System
- `/balance` - Check coin balance
- `/daily` - Claim daily reward with streak bonuses
- `/give` - Give coins to another user
- `/leaderboard` - View richest members
- `/addcoins` - Add coins (Admin only)
- `/removecoins` - Remove coins (Admin only)

### Games
- `/coinflip` - Bet on coin flips
- `/dice` - Roll dice against the bot
- `/slots` - Play slot machine
- `/count setup` - Set up counting game channel
- `/count stats` - View counting statistics
- `/count reset` - Reset the count

### Ticket System
- `/ticket setup` - Set up ticket panel
- `/ticket close` - Close current ticket
- `/ticket add` - Add user to ticket
- `/ticket remove` - Remove user from ticket

### Utility
- `/help` - View all commands
- `/ping` - Check bot latency
- `/serverinfo` - View server information
- `/userinfo` - View user information

## Setup Instructions

### 1. Create a Discord Bot
1. Go to [Discord Developer Portal](https://discord.com/developers/applications)
2. Create a new application
3. Go to "Bot" section and create a bot
4. Enable these Privileged Gateway Intents:
   - Presence Intent
   - Server Members Intent
   - Message Content Intent
5. Copy the bot token

### 2. Configure Environment Variables
Set the following secrets:
- `DISCORD_TOKEN` - Your bot token
- `CLIENT_ID` - Your application's client ID

### 3. Invite the Bot
1. Go to OAuth2 > URL Generator
2. Select scopes: `bot`, `applications.commands`
3. Select permissions: Administrator
4. Use the generated URL to invite the bot to your server

### 4. Deploy Commands
Run `npm run deploy` to register slash commands with Discord

### 5. Start the Bot
Run `npm start` to start the bot

## Data Storage
The bot uses JSON files for data persistence:
- `economy.json` - User balances
- `countgame.json` - Counting game data
- `tickets.json` - Ticket system data
- `daily.json` - Daily reward cooldowns
