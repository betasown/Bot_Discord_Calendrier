const { SlashCommandBuilder, EmbedBuilder } = require('discord.js')
const ical = require('node-ical')

const datesAreOnSameDay = (first, second) =>
    first.getFullYear() === second.getFullYear() &&
    first.getMonth() === second.getMonth() &&
    first.getDate() === second.getDate()

const dateOptions = { hour: 'numeric', minute: 'numeric' }

const dateDiff = (before, after) => {
    let diff = after - before
    let diffH = Math.floor(diff / 3600000)
    let diffM = Math.floor((diff % 3600000) / 60000)

    let strH = function () { if (diffH > 1) return 'heures'; else return 'heure' }()
    let strM = function () { if (diffM > 1) return 'minutes'; else return 'minute' }()

    if (diffH && diffM) return `(${diffH} ${strH}, ${diffM} ${strM})`
    else if (diffH) return `(${diffH} ${strH})`
    else if (diffM) return `(${diffM} ${strM})`
    else return ''
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName('edt')
        .setDescription('Affiche les évènements du jour depuis le calendrier sur Teams')
        .addStringOption(option => option.setName("date").setDescription("format requis : aaaa-mm-jj")),
    async execute(interaction) {
        // Créer une date à aujourd'hui et prendre celle demandée si c'est le cas
        let date = new Date()
        const dateOption = interaction.options.getString('date')
        if (dateOption) date = new Date(Date.parse(dateOption))

        // Télécharger le calendrier et le parser
        const calendarUrl = 'https://outlook.office365.com/owa/calendar/2321713d4b3642bbbeb7c5254b7ea057@cesi.fr/96e7a946f8414ef78608a28997c228463714143147821466256/S-1-8-179141276-3804106660-3851968801-3084725192/reachcalendar.ics'
        const webEvents = await ical.async.fromURL(calendarUrl)
        if (!webEvents) return interaction.reply({ content: 'Impossible de récupérer les évènements !', ephemeral: true })

        // Récupérer les évènements du jour demandé
        let events = Object.values(webEvents).filter(event => {
            let eventDate = new Date(event.start)
            return datesAreOnSameDay(eventDate, date)
        })
        if (!events.length) return interaction.reply({ content: `Aucun évènement trouvé pour le ${date.toLocaleDateString('fr-FR')} !` })

        // Trier les évènements par date de début
        events = events.sort((a, b) => { return new Date(a.start) - new Date(b.start) })

        // Générer des parties de l'embed avec chaque évènement
        let fields = []
        events.forEach(event => fields = fields.concat({
            name: event.summary,
            value: `De ${event.start.toLocaleTimeString('fr-FR', dateOptions)} à ${event.end.toLocaleTimeString('fr-FR', dateOptions)} ${dateDiff(event.start, event.end)}` +
                function () { if (event.location) return ` | Salle ${event.location}`; else return '' }()
        }))

        // Créer un embed et l'envoyer
        let embed = new EmbedBuilder()
            .setTitle(`Évènements du ${date.toLocaleDateString('fr-FR')}`)
            .setColor('#ffffff')
            .setTimestamp()
            .addFields(fields)
        return interaction.reply({ embeds: [embed] })
    }
}