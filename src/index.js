require('dotenv').config();
const { Client, IntentsBitField, EmbedBuilder } = require('discord.js');
const cron = require('node-cron');

const client = new Client({
	intents: [
		IntentsBitField.Flags.Guilds,
		IntentsBitField.Flags.GuildMembers,
		IntentsBitField.Flags.GuildMessages,
	],
});

// Function to send a message to a user
const sendAttendanceMessage = (cronSchedule, guildId, roleId, embed) => {
	cron.schedule(cronSchedule, () => {
		const guild = client.guilds.cache.get(guildId);
		const role = guild.roles.cache.get(roleId);

		// Fetch members from the server
		guild.members.fetch().then((members) => {
			// Send the message to each member's DM if they have the specified role
			members.each((member) => {
				// check if member has specified role
				if (member.roles.cache.has(role.id)) {
					member.user.send({ embeds: [embed] });
				}
			});
		});
	});
};

client.once('ready', () => {
	console.log(`Logged in as ${client.user.tag}`);

	const guildId = '1070105744474644571';
	const roleId = '1195055503034818672';

	// Embed message constructor
	const embed = new EmbedBuilder()
		.setColor(0x0099ff)
		.setTitle('Attendance Submission')
		.setDescription("Don't forget to submit your attendance");

	// Use the function to send message at 08:55 every weekday
	sendAttendanceMessage('55 8 * * 1-5', guildId, roleId, embed);
	// Use the function to send message at 13:25 every weekday
	sendAttendanceMessage('25 13 * * 1-5', guildId, roleId, embed);
	// Use the function to send message every minute
	sendAttendanceMessage('* * * * *', guildId, roleId, embed);
});

client.login(process.env.Token);
