require('dotenv').config();
const { Client, IntentsBitField, EmbedBuilder } = require('discord.js');
const CronJob = require('cron').CronJob;

const client = new Client({
	intents: [
		IntentsBitField.Flags.Guilds,
		IntentsBitField.Flags.GuildMembers,
		IntentsBitField.Flags.GuildMessages,
	],
});

// Function to send a message to a user
const sendAttendanceMessage = (guildId, roleId, embed) => {
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

	// Schedule the function to run at 08:55 every weekday CET
	const job1 = new CronJob(
		'55 8 * * 1-5',
		() => {
			sendAttendanceMessage(guildId, roleId, embed);
		},
		null,
		true,
		'Europe/Brussels'
	); // Set the timezone to CET (Europe/Berlin)

	// Schedule the function to run at 13:25 every weekday CET
	const job2 = new CronJob(
		'25 13 * * 1-5',
		() => {
			sendAttendanceMessage(guildId, roleId, embed);
		},
		null,
		true,
		'Europe/Brussels'
	);
	/* 	const job3 = new CronJob(
		'7 12 * * *',
		() => {
			sendAttendanceMessage(guildId, roleId, embed);
		},
		null,
		true,
		'Europe/Brussels'
	); */

	// Start the cron jobs
	job1.start();
	job2.start();
	// job3.start();
});

client.login(process.env.TOKEN);
