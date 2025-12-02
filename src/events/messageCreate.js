import { getCountGame, setCountGame, addBalance } from '../utils/database.js';

export default {
  name: 'messageCreate',
  async execute(message, client) {
    if (message.author.bot) return;
    if (!message.guild) return;
    
    const countGame = getCountGame(message.guild.id);
    
    if (countGame.channelId && message.channel.id === countGame.channelId) {
      const number = parseInt(message.content);
      
      if (isNaN(number)) return;
      
      if (message.author.id === countGame.lastUserId) {
        await message.react('❌');
        await message.reply(`You can't count twice in a row! The count has been reset. We reached **${countGame.currentNumber}**!`);
        
        if (countGame.currentNumber > countGame.highScore) {
          countGame.highScore = countGame.currentNumber;
        }
        countGame.currentNumber = 0;
        countGame.lastUserId = null;
        setCountGame(message.guild.id, countGame);
        return;
      }
      
      if (number === countGame.currentNumber + 1) {
        await message.react('✅');
        countGame.currentNumber = number;
        countGame.lastUserId = message.author.id;
        
        if (number > countGame.highScore) {
          countGame.highScore = number;
        }
        
        if (number % 10 === 0) {
          addBalance(message.guild.id, message.author.id, 10);
          await message.reply(`🎉 Milestone! You earned **10 coins** for reaching ${number}!`);
        } else if (number % 5 === 0) {
          addBalance(message.guild.id, message.author.id, 5);
        }
        
        setCountGame(message.guild.id, countGame);
      } else {
        await message.react('❌');
        await message.reply(`Wrong number! Expected **${countGame.currentNumber + 1}**. The count has been reset. We reached **${countGame.currentNumber}**!`);
        
        if (countGame.currentNumber > countGame.highScore) {
          countGame.highScore = countGame.currentNumber;
        }
        countGame.currentNumber = 0;
        countGame.lastUserId = null;
        setCountGame(message.guild.id, countGame);
      }
    }
  },
};
