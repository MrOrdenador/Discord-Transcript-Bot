const { 
  EmbedBuilder, 
  ActionRowBuilder, 
  ButtonBuilder, 
  ButtonStyle, 
  ChannelType, 
} = require('discord.js');
const axios = require('axios');
require('dotenv').config();

module.exports = (client) => {
  client.on('interactionCreate', async (interaction) => {
    try {
      if (interaction.isChatInputCommand() && interaction.commandName === 'ticket-setup') {
        const row = new ActionRowBuilder().addComponents(
          new ButtonBuilder()
            .setCustomId('open-ticket')
            .setLabel('Open Support Ticket')
            .setStyle(ButtonStyle.Primary)
            .setEmoji('📩')
        );

        const embed = new EmbedBuilder()
          .setTitle('Support Ticket System')
          .setDescription('Click the button below to create a support ticket.')
          .setColor('Blue')
          .setThumbnail(interaction.guild.iconURL());

        await interaction.channel.send({
          embeds: [embed],
          components: [row],
        });

        await interaction.reply({
          content: 'The tickets have been set up!',
          ephemeral: true,
        });
      }

      if (interaction.isButton()) {
        const user = interaction.user;
        const guild = interaction.guild;
        const openTime = Math.floor(Date.now() / 1000); // Ticket opening time

        if (interaction.customId === 'open-ticket') {
          const channelName = `${user.tag}-ticket`.replace(/[^a-zA-Z0-9-]/g, '-');

          const ticketChannel = await guild.channels.create({
            name: channelName,
            type: ChannelType.GuildText,
            topic: `Support ticket for ${user.tag} (ID: ${user.id})`,
            permissionOverwrites: [
              {
                id: guild.roles.everyone.id,
                deny: ['ViewChannel'],
              },
              {
                id: user.id,
                allow: ['ViewChannel', 'SendMessages', 'ReadMessageHistory'],
              },
              {
                id: process.env.STAFF_ROLE_ID,
                allow: ['ViewChannel', 'SendMessages', 'ReadMessageHistory'],
              }
            ],
          });

          const embed = new EmbedBuilder()
            .setTitle('Support Ticket')
            .setThumbnail(interaction.guild.iconURL())
            .setDescription(`**User:** ${user}\n__Please state your issue and wait until a support team member comes to assist you!__`)
            .setColor('Green')
            .setTimestamp();

          const deleteChannelRow = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
              .setCustomId('delete-ticket')
              .setLabel('Close the Ticket')
              .setStyle(ButtonStyle.Danger)
              .setEmoji('🔒')
          );

          ticketChannel.send({
            content: `${interaction.user}`,
          }).then((message) => {
            message.delete({ timeout: 1 });
          });

          await ticketChannel.send({
            embeds: [embed],
            components: [deleteChannelRow],
          });

          await interaction.reply({
            content: `Your ticket has been created: ${ticketChannel}`,
            ephemeral: true,
          });
        } else if (interaction.customId === 'delete-ticket') {
          const channel = interaction.channel;

          if (channel && channel.isTextBased()) {
            const ticketOpenerId = channel.topic.match(/ID: (\d+)/)?.[1];
            const ticketOpener = await guild.members.fetch(ticketOpenerId).catch(() => null);

            if (!ticketOpener) {
              await interaction.reply({
                content: 'Unable to find the original ticket opener. Proceeding with ticket closure.',
                ephemeral: true,
              });
            }

            const time = Math.floor(Date.now() / 1000) + 15;
            await interaction.reply({
              content: `The ticket has been closed and the channel will be deleted in approximately <t:${time}:R>. Thank you for using the support!`,
              ephemeral: false,
            });

            const transcriptTask = axios.post(
              `https://www.cookie-api.com/api/transcript`,
              {
                bot_token: process.env.TOKEN.toString(),
              },
              {
                headers: {
                  Authorization: process.env.COOKIE.toString(),
                },
                params: {
                  channel_id: `${channel.id}`,
                },
              }
            ).then(async (transcriptResponse) => {
              const transcriptURL = transcriptResponse.data.url;

              if (transcriptURL) {
                const closeTime = Math.floor(Date.now() / 1000); // closing time
                const closeEmbed = new EmbedBuilder()
                  .setAuthor({
                    name: `${ticketOpener?.user.tag}'s ticket`,
                    iconURL: ticketOpener?.user.displayAvatarURL(),
                  })
                  .setTimestamp()
                  .setThumbnail(interaction.guild.iconURL())
                  .setDescription(
                    `👑 **Owner:** ${ticketOpener} / \`${ticketOpener?.user.tag}\`\n` +
                    `🆔 **Owner's ID:** \`${ticketOpenerId}\`\n` +
                    `🔒 **Closed By:** ${interaction.user} / \`${interaction.user.tag}\`\n` +
                    `⏰ **Opened at:** <t:${openTime}:F>\n` +
                    `🕒 **Closed at:** <t:${closeTime}:F>`
                  )
                  .setColor('Blue');

                const closeRow = new ActionRowBuilder().addComponents(
                  new ButtonBuilder()
                    .setLabel('Transcript')
                    .setStyle(ButtonStyle.Link)
                    .setURL(transcriptURL)
                );

                if (ticketOpener) {
                  ticketOpener.send({
                    content: `Thank you for using the ticket system! Here you have the info:`,
                    embeds: [closeEmbed],
                    components: [closeRow],
                  }).catch((err) => {
                    console.error('Failed to send DM to user:', err);
                  });
                }

                const responseChannelID = process.env.TRANSCRIPTS_CHANNEL_LOG
                await axios.post(
                  `https://discord.com/api/v10/channels/${responseChannelID}/messages`,
                  {
                    embeds: [closeEmbed],
                    components: [closeRow],
                  },
                  {
                    headers: {
                      Authorization: `Bot ${process.env.TOKEN}`,
                      'Content-Type': 'application/json',
                    },
                  }
                );
              } else {
                console.error('Transcript URL not found in response:', transcriptResponse.data);
              }
            }).catch((apiError) =>
              console.error('Failed to fetch or send transcript:', apiError.response?.data || apiError.message)
            );

            setTimeout(async () => {
              try {
                await channel.delete();
              } catch (deleteError) {
                console.error('Failed to delete the ticket channel:', deleteError);
              }
            }, 15000);
          }
        }
      }
    } catch (error) {
      console.error('Error handling interaction:', error);
      if (interaction.replied || interaction.deferred) {
        await interaction.followUp({
          content: 'An error occurred while processing your request.',
          ephemeral: true,
        });
      } else {
        await interaction.reply({
          content: 'An error occurred while processing your request.',
          ephemeral: true,
        });
      }
    }
  });
};
