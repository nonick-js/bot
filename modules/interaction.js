const discord = require('discord.js');
const fs = require('fs');
const pathModule = require('path');

/**
 * @callback InteractionCallback
 * @param {discord.Interaction} interaction
 * @param {discord.Client} client
 * @returns {void}
 */
/**
 * @typedef ContextMenuData
 * @prop {string} customid
 * @prop {"BUTTON"|"SELECT_MENU"} type
 */
/**@typedef {discord.ApplicationCommandData|ContextMenuData} InteractionData */
/**@typedef {{data:InteractionData,exec:InteractionCallback}} commandData*/
/**@typedef {discord.Collection<string,commandData[]>} commands */

class Interactions {
    /**@type {commands} */
    #commands = new discord.Collection();
    /**
     * @constructor
     * @param {string} path
     */
    constructor(path) {
        getAllPath(path).forEach(v => {
            /**@type {commandData} */
            const commandData = require(v);
            this.commands.set(commandData.data.type,[...this.commands.get(commandData.data.type)??[],commandData]);
        });
    }
    
    /**
     * @param {discord.Client} client
     * @param {string} [guildId]
     */
    async register(client,guildId) {
        const command = await client.application.commands.fetch();
        this.commands.each(data => data.forEach(cmd => {
            if(!cmd.data?.name) return;
            if(command.some(v => v.name == cmd.data.name)) {
                const findCmd = command.find(v => v.name == cmd.data.name);
                findCmd.edit(cmd.data);
            }
            else {
                client.application.commands.create(cmd.data,guildId);
            }
        }));
    }

    /**
     * @param {discord.Interaction} interaction
     */
    getCommand(interaction) {
        if(interaction.isCommand()) return this.commands.get('CHAT_INPUT').find(v => v.data.name == interaction.commandName);
        if(interaction.isMessageContextMenu()) return this.commands.get('MESSAGE').find(v => v.data.name == interaction.commandName);
        if(interaction.isUserContextMenu()) return this.commands.get('USER').find(v => v.data.name == interaction.commandName);
        if(interaction.isButton()) return this.commands.get('BUTTON').find(v => v.data.name == interaction.commandName);
        if(interaction.isSelectMenu()) return this.commands.get('SELECT_MENU').find(v => v.data.name == interaction.commandName);
    }

    get commands() {
        return this.#commands;
    }
}

/**
 * @param {string} path
 * @param {Set<string>} [pre]
 * @returns {string[]}
 */
function getAllPath(path,pre=new Set()) {
    const dir = fs.readdirSync(path,{withFileTypes:true});
    dir.forEach(v => {
        if(v.isFile() && !v.name.startsWith('_')) return pre.add(pathModule.resolve(path,v.name));
        if(v.isDirectory()) getAllPath(pathModule.resolve(path,v.name),pre);
    });
    return [...pre];
}

module.exports = Interactions;