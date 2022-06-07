import { Client } from '@common/client';
import { ApplicationCommands } from '@common/commands/application-commands';
import { getConfigVariable } from '@common/utils/get-config-variable';
import { Intents } from 'discord.js';
import { config } from 'dotenv';

config();

const client = Client.getInstance({
    intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MESSAGES,
        Intents.FLAGS.DIRECT_MESSAGES,
        Intents.FLAGS.DIRECT_MESSAGE_REACTIONS,
        Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
        Intents.FLAGS.GUILD_EMOJIS_AND_STICKERS,
        Intents.FLAGS.GUILD_BANS,
        Intents.FLAGS.GUILD_INVITES,
    ],
});

async function initialize() {
    const applicationCommands = await ApplicationCommands.getInstance();
    await applicationCommands.deploy();

    await client.login(getConfigVariable('TOKEN'));
}

initialize().then();
