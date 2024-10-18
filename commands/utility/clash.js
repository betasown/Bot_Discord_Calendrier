const { SlashCommandBuilder } = require('discord.js');
const fs = require('node:fs');
const path = require('node:path');

module.exports = {
    cooldown: 5, // 5 secondes de cooldown
    data: new SlashCommandBuilder()
        .setName('clash')
        .setDescription('Un clash aléatoire de Yulia !'),
        async execute(interaction) {
            try {
                const soundsFolder = path.join(__dirname, '../../son/');
    
                const files = fs.readdirSync(soundsFolder);
    
                const mp3Files = files.filter(file => file.endsWith('.mp3'));
    
                if (mp3Files.length === 0) {
                    return interaction.reply('Aucun fichier MP3 trouvé dans le répertoire.');
                }
    
                const randomIndex = Math.floor(Math.random() * mp3Files.length); 
                const randomFile = mp3Files[randomIndex];
    
                const filePath = path.join(soundsFolder, randomFile);
    
                return interaction.reply({
                    files: [{
                        attachment: filePath,
                        name: randomFile,
                    }],
                });
            } catch (error) {
                console.error(error);
                return interaction.reply('Une erreur est survenue lors de la sélection du fichier.');
            }
        },
    };
