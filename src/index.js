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

		if (!guild || !role) {
			console.error('Guild or role not found.');
			return;
		}

		// Fetch members with the specified role
		guild.members.fetch().then((members) => {
			// Send the message to each member's DM if they have the specified role
			members.each((member) => {
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

	const embed = new EmbedBuilder()
		.setColor(0x0099ff)
		.setTitle('Attendance Submission')
		.setDescription("Don't forget to submit your attendance");

	// Use the function to send messages every minute
	sendAttendanceMessage('55 8 * * 1-5', guildId, roleId, embed);
	sendAttendanceMessage('25 13 * * 1-5', guildId, roleId, embed);
	sendAttendanceMessage('* * * * *', guildId, roleId, embed);
});

client.login(process.env.Token);
