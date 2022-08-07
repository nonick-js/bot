const discord = require('discord.js');
const swicher = require('../../../modules/swicher');

/**
* @callback InteractionCallback
* @param {discord.Client} client
* @param {discord.SelectMenuInteraction} interaction
* @returns {void}
*/
/**
* @typedef ContextMenuData
* @prop {string} customid
* @prop {'BUTTON'|'SELECT_MENU'} type
*/

module.exports = {
    /** @type {discord.ApplicationCommandData|ContextMenuData} */
    data: { customid: 'setting-select', type: 'SELECT_MENU' },
    /** @type {InteractionCallback} */
    exec: async (client, interaction, Configs, language) => {

        const config = await Configs.findOne({ where: { serverId: interaction.guildId } });
        const button = new discord.MessageActionRow().addComponents(
            new discord.MessageButton()
            .setCustomId('setting-back')
            .setEmoji('971389898076598322')
            .setStyle('PRIMARY'),
        );

        if (interaction.values == 'setting-welcomemessage') {
            const { welcome, welcomeCh, welcomeMessage, leave, leaveCh } = config.get();

            const embed = new discord.MessageEmbed()
                .setTitle(language('Setting.WelcomeMessage.Embed.Title'))
                .setDescription(language('Setting.WelcomeMessage.Embed.Description'))
                .setColor('2f3136')
                .addFields(
                    { name: `${language('Setting.WelcomeMessage.Embed.Field.Name_1')}`, value: swicher.chStatusSwicher(language, welcome, welcomeCh), inline:true },
                    { name: `${language('Setting.WelcomeMessage.Embed.Field.Name_2')}`, value: swicher.chStatusSwicher(language, leave, leaveCh), inline:true },
                    { name: `${language('Setting.WelcomeMessage.Embed.Field.Name_3')}`, value: welcomeMessage || 'SETTING_NONE' },
                );
            const select = new discord.MessageActionRow().addComponents([
                new discord.MessageSelectMenu()
                    .setCustomId('welcomeSetting')
                    .addOptions([
                        { label: `${language('Setting.WelcomeMessage.Select.Option.Label_1')}`, value: 'setting-welcome-1', description: `${language('Setting.WelcomeMessage.Select.Option.Description_1')}`, emoji: '966588719635267624', default: true },
                        { label: `${language('Setting.WelcomeMessage.Select.Option.Label_2')}`, value: 'setting-welcome-2', description: `${language('Setting.WelcomeMessage.Select.Option.Description_2')}`, emoji: '966588719635267624' },
                    ]),
            ]);

            button.addComponents([
                new discord.MessageButton()
                    .setCustomId('setting-welcome')
                    .setLabel(swicher.buttonLabelSwicher(language, welcome))
                    .setStyle(swicher.buttonStyleSwicher(welcome))
                    .setDisabled(swicher.buttonDisableSwicher(welcomeCh)),
                new discord.MessageButton()
                    .setCustomId('setting-welcomeCh')
                    .setLabel(language('Setting.Common.Button.Ch'))
                    .setEmoji('966588719635267624')
                    .setStyle('SECONDARY'),
                new discord.MessageButton()
                    .setCustomId('setting-welcomeMessage')
                    .setLabel(language('Setting.Common.Button.Message'))
                    .setEmoji('966596708458983484')
                    .setStyle('SECONDARY'),
            ]);
            interaction.update({ embeds: [embed], components: [select, button] });
        }

        if (interaction.values == 'setting-report') {
            const { reportCh, reportRoleMention, reportRole } = config.get();

            const embed = new discord.MessageEmbed()
                .setTitle(language('Setting.Report.Embed.Title'))
                .setDescription(language('Setting.Report.Embed.Description'))
                .setColor('2f3136')
                .addFields(
                    { name: `${language('Setting.Report.Embed.Field.Name_1')}`, value: reportCh ? `<#${reportCh}>` : `${language('Setting.Common.Embed.None')}`, inline: true },
                    { name: `${language('Setting.Report.Embed.Field.Name_2')}`, value: swicher.roleStatusSwicher(language, reportRoleMention, reportRole), inline: true },
                );
            const select = new discord.MessageActionRow().addComponents([
                new discord.MessageSelectMenu()
                .setCustomId('reportSetting')
                .addOptions([
                    { label: `${language('Setting.Report.Select.Option.Label_1')}`, value: 'setting-report-1', emoji: '🌐', default: true },
                    { label: `${language('Setting.Report.Select.Option.Label_2')}`, description: `${language('Setting.Report.Select.Option.Description_2')}`, value: 'setting-report-2', emoji: '966719258430160986' },
                ]),
            ]);

            button.addComponents([
                new discord.MessageButton()
                    .setCustomId('setting-reportCh')
                    .setLabel(language('Setting.Common.Button.Ch'))
                    .setStyle('SECONDARY')
                    .setEmoji('966588719635267624'),
            ]);
            interaction.update({ embeds: [embed], components: [select, button] });
        }

        if (interaction.values == 'setting-linkOpen') {
            const linkOpen = config.get('linkOpen');

            const embed = new discord.MessageEmbed()
                .setTitle(language('Setting.MessageExpansion.Embed.Title'))
                .setDescription(language('Setting.MessageExpansion.Embed.Description'))
                .setColor('2f3136')
                .addFields({ name: language('Setting.MessageExpansion.Embed.Field.Name_1'), value: swicher.statusSwicher(language, linkOpen), inline: true });
            const select = new discord.MessageActionRow().addComponents([
                new discord.MessageSelectMenu()
                    .setCustomId('linkOpenSetting')
                    .addOptions({ label: `${language('Setting.MessageExpansion.Select.Option.Label_1')}`, value: 'setting-linkOpen-1', emoji: '966588719635267624', default:true }),
            ]);

            button.addComponents([
                new discord.MessageButton()
                    .setCustomId('setting-linkOpen')
                    .setLabel(swicher.buttonLabelSwicher(language, linkOpen))
                    .setStyle(swicher.buttonStyleSwicher(linkOpen)),
            ]);
            interaction.update({ embeds: [embed], components: [select, button], ephemeral:true });
        }
    },
};