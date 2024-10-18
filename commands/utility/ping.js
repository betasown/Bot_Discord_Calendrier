const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    cooldown: 5,
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('Répond avec pong!'),
	async execute(interaction) {
		await interaction.reply('Pong ! ||( Tg mathéo )||');
	},
};