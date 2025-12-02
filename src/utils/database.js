import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const dataDir = join(__dirname, '../../data');

function ensureFile(filename, defaultData = {}) {
  const filepath = join(dataDir, filename);
  if (!existsSync(filepath)) {
    writeFileSync(filepath, JSON.stringify(defaultData, null, 2));
  }
  return filepath;
}

function readData(filename) {
  const filepath = ensureFile(filename, {});
  try {
    return JSON.parse(readFileSync(filepath, 'utf8'));
  } catch {
    return {};
  }
}

function writeData(filename, data) {
  const filepath = join(dataDir, filename);
  writeFileSync(filepath, JSON.stringify(data, null, 2));
}

export function getBalance(guildId, userId) {
  const data = readData('economy.json');
  const key = `${guildId}-${userId}`;
  return data[key]?.balance || 0;
}

export function setBalance(guildId, userId, amount) {
  const data = readData('economy.json');
  const key = `${guildId}-${userId}`;
  if (!data[key]) {
    data[key] = { balance: 0, guildId, userId };
  }
  data[key].balance = amount;
  writeData('economy.json', data);
  return amount;
}

export function addBalance(guildId, userId, amount) {
  const current = getBalance(guildId, userId);
  return setBalance(guildId, userId, current + amount);
}

export function removeBalance(guildId, userId, amount) {
  const current = getBalance(guildId, userId);
  return setBalance(guildId, userId, Math.max(0, current - amount));
}

export function getLeaderboard(guildId, limit = 10) {
  const data = readData('economy.json');
  const guildUsers = Object.entries(data)
    .filter(([key]) => key.startsWith(`${guildId}-`))
    .map(([key, value]) => ({
      userId: key.split('-')[1],
      balance: value.balance,
    }))
    .sort((a, b) => b.balance - a.balance)
    .slice(0, limit);
  return guildUsers;
}

export function getCountGame(guildId) {
  const data = readData('countgame.json');
  return data[guildId] || { currentNumber: 0, lastUserId: null, channelId: null, highScore: 0 };
}

export function setCountGame(guildId, gameData) {
  const data = readData('countgame.json');
  data[guildId] = gameData;
  writeData('countgame.json', data);
}

export function getTickets(guildId) {
  const data = readData('tickets.json');
  return data[guildId] || { tickets: [], categoryId: null, logChannelId: null, counter: 0 };
}

export function setTickets(guildId, ticketData) {
  const data = readData('tickets.json');
  data[guildId] = ticketData;
  writeData('tickets.json', data);
}

export function addTicket(guildId, ticket) {
  const ticketData = getTickets(guildId);
  ticketData.counter++;
  ticket.id = ticketData.counter;
  ticketData.tickets.push(ticket);
  setTickets(guildId, ticketData);
  return ticket;
}

export function closeTicket(guildId, channelId) {
  const ticketData = getTickets(guildId);
  const ticketIndex = ticketData.tickets.findIndex(t => t.channelId === channelId);
  if (ticketIndex !== -1) {
    ticketData.tickets[ticketIndex].status = 'closed';
    ticketData.tickets[ticketIndex].closedAt = Date.now();
    setTickets(guildId, ticketData);
    return ticketData.tickets[ticketIndex];
  }
  return null;
}

export function getDailyReward(guildId, userId) {
  const data = readData('daily.json');
  const key = `${guildId}-${userId}`;
  return data[key] || { lastClaim: 0, streak: 0 };
}

export function setDailyReward(guildId, userId, rewardData) {
  const data = readData('daily.json');
  const key = `${guildId}-${userId}`;
  data[key] = rewardData;
  writeData('daily.json', data);
  }
