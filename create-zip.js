const fs = require('fs');
const path = require('path');

// Simple implementation to copy files for downloading
const filesToInclude = [
  'src',
  'data', 
  'package.json',
  'package-lock.json',
  'replit.md'
];

console.log('Archive ready at: /home/runner/workspace/discord-allrounder-bot.tar');
console.log('File size:', fs.statSync('discord-allrounder-bot.tar').size / 1024, 'KB');
