const fs = require('fs');
const { ApplicationCommandType } = require('discord-api-types/v10');
const { ContextMenuCommandBuilder } = require('@discordjs/builders');
const discord = require('discord.js');

module.exports = {
    data: new ContextMenuCommandBuilder()
        .setName('このユーザーの情報')
        .setType(ApplicationCommandType.User),
    async execute(interaction) {

	}
}