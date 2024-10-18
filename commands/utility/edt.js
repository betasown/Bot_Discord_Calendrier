const { SlashCommandBuilder, EmbedBuilder } = require('discord.js')
const ical = require('node-ical')

const datesAreOnSameDay = (first, second) =>
    first.getFullYear() === second.getFullYear() &&
    first.getMonth() === second.getMonth() &&
    first.getDate() === second.getDate()

const dateOptions = { hour: '2-digit', minute: '2-digit' }

module.exports = {
    data: new SlashCommandBuilder()
        .setName('edt')
        .setDescription('Affiche les événements du jour depuis Google Calendar'),
    async execute(interaction) {
        const webEvents = await ical.async.fromURL('https://outlook.office365.com/owa/calendar/2321713d4b3642bbbeb7c5254b7ea057@cesi.fr/96e7a946f8414ef78608a28997c228463714143147821466256/S-1-8-179141276-3804106660-3851968801-3084725192/reachcalendar.ics');
        if (!webEvents) return interaction.reply({ content: 'Impossible de récupérer les événements !', ephemeral: true })

        // Get the data from today
        const today = new Date()
        const events = Object.values(webEvents).filter(event => {
            const eventDate = new Date(event.start)
            return datesAreOnSameDay(eventDate, today)
        })

        let fields = []
        events.forEach(event => fields = fields.concat({
            name: event.summary,
            value: `De ${event.start.toLocaleTimeString(dateOptions)} à ${event.end.toLocaleTimeString(dateOptions)}` +
                function () { if (event.location) return ` | Salle ${event.location}`; else return '' }()
        }))

        // Create an embed
        let embed = new EmbedBuilder()
            .setTitle('Événements du jour')
            .setColor('#ffffff')
            .setTimestamp()
            .addFields(fields)
        interaction.reply({ embeds: [embed] })
    }
}