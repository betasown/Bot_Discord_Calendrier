const { SlashCommandBuilder, EmbedBuilder, SlashCommandSubcommandGroupBuilder } = require('discord.js')
const ical = require('node-ical')

const datesAreOnSameDay = (first, second) =>
    first.getFullYear() === second.getFullYear() &&
    first.getMonth() === second.getMonth() &&
    first.getDate() === second.getDate()

const dateOptions = { hour: '2-digit', minute: '2-digit' }

module.exports = {
    data: new SlashCommandBuilder()
        .setName('edt')
        .setDescription('Affiche les événements du jour depuis le calendrier sur Teams')
        .addStringOption(option=>
            option.setName("date")
                .setDescription("format requis : aaaa-mm-jj")
        ),
    async execute(interaction) {
        const dateOption = interaction.options.getString('date');
        let date = new Date();

        if (dateOption) {
            console.log(dateOption)
            console.log(Date.parse(dateOption))
            date = new Date(Date.parse(dateOption));
        }
        console.log(date)

        const calendarUrl = 'https://outlook.office365.com/owa/calendar/2321713d4b3642bbbeb7c5254b7ea057@cesi.fr/96e7a946f8414ef78608a28997c228463714143147821466256/S-1-8-179141276-3804106660-3851968801-3084725192/reachcalendar.ics'
        const webEvents = await ical.async.fromURL(calendarUrl)
        if (!webEvents) return interaction.reply({ content: 'Impossible de récupérer les événements !', ephemeral: true })

        const events = Object.values(webEvents).filter(event => {
            const eventDate = new Date(event.start)
            return datesAreOnSameDay(eventDate, date)
        })

        if (!events) interaction.reply({ content: 'Aucun évènement trouvé !' })

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