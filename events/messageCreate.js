const { Events } = require('discord.js');
const axios = require('axios');

module.exports = {
    name: Events.MessageCreate,
    async execute(message) {
        // Ignore les messages du bot lui-même
        if (message.author.bot) return;
        
        // Vérifie si c'est l'utilisateur spécifique
        if (message.author.id !== '385492297716072458') return;
        
        try {
            // Appel à l'API Tenor pour récupérer un GIF de singe
            const response = await axios.get('https://tenor.googleapis.com/v2/search', {
                params: {
                    q: 'monkey funny',
                    key: process.env.TENOR_API_KEY,
                    limit: 20,
                    random: true
                }
            });

            if (response.data && response.data.results && response.data.results.length > 0) {
                // Sélectionne un GIF aléatoire parmi les résultats
                const randomIndex = Math.floor(Math.random() * response.data.results.length);
                const gifUrl = response.data.results[randomIndex].media_formats.gif.url;
                
                // Répond au message avec le GIF
                await message.reply(gifUrl);
            } else {
                // Si aucun GIF trouvé avec l'API, utilise des GIFs prédéfinis
                const monkeyGifs = [
                    'https://media.tenor.com/TyGlryWfKOAAAAAC/monkey-funny.gif',
                    'https://media.tenor.com/BK4VmOhGPokAAAAC/monkey-dancing.gif',
                    'https://media.tenor.com/qICdWCcSuoAAAAAd/monkey-typing.gif',
                    'https://media.tenor.com/2nKSTdB5ng4AAAAC/monkey-computer.gif',
                    'https://media.tenor.com/fSBaSdBlOGsAAAAC/monkey-confused.gif'
                ];
                
                const randomGif = monkeyGifs[Math.floor(Math.random() * monkeyGifs.length)];
                await message.reply(randomGif);
            }
            
        } catch (error) {
            console.error('Erreur lors de la récupération du GIF:', error);
            // En cas d'erreur, réagit juste avec un emoji
            await message.react('🐵');
        }
    },
};
