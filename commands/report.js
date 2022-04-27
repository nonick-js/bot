const fs = require('fs');
const { ApplicationCommandType } = require('discord-api-types/v10');
const { ContextMenuCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');
// const discordModals = require('discord-modals');
// discordModals(client);

module.exports = {
data: new ContextMenuCommandBuilder()
        .setName('テスト')
        .setType(ApplicationCommandType.Message),
	async execute(interaction) {
        interaction.reply('テスト')
    }
}