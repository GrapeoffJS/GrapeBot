import { Client } from '@common/client';
import { ApplicationCommands } from '@common/commands/application-commands';
import { MongoDBConnectionURIBuilder } from '@common/utils/MongoDBConnectionURIBuilder';
import { readConfigVariable } from '@common/utils/read-config-variable';
import { Intents } from 'discord.js';
import { config } from 'dotenv';
import mongoose from 'mongoose';

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
    try {
        await mongoose.connect(
            new MongoDBConnectionURIBuilder()
                .setProtocol(readConfigVariable('MONGODB_PROTOCOL'))
                .setUsername(readConfigVariable('MONGODB_USERNAME'))
                .setPassword(readConfigVariable('MONGODB_PASSWORD'))
                .setHostname(readConfigVariable('MONGODB_HOSTNAME'))
                .setQueryParams(readConfigVariable('MONGODB_CONNECTION_PARAMS'))
                .build(),
            {
                authSource: 'admin',
                dbName: readConfigVariable('MONGODB_DATABASE_NAME'),
            },
        );
    } catch (error) {
        console.log(error);
    }

    const applicationCommands =
        await ApplicationCommands.getInstance().registerAllApplicationCommands();
    await applicationCommands.deploy();

    await client.login(readConfigVariable('TOKEN'));
}

initialize().then();
