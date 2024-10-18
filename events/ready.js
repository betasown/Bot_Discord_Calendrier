const { Events, ActivityType } = require('discord.js');

module.exports = {
	name: Events.ClientReady,
	once: true,
	execute(client) {
		client.user.setActivity('te surveiller !', { type: ActivityType.Streaming })
		console.log(`Ready! Logged in as ${client.user.tag}`);
	},
};