import { DiscordClient } from '@common/DiscordClient';
import { MongoDBConnectionURIBuilder } from '@common/utils/MongoDBConnectionURIBuilder';
import { readConfigVariable } from '@common/utils/read-config-variable';
import { Intents } from 'discord.js';
import { config } from 'dotenv';
import mongoose from 'mongoose';

import { NotifyApplicationStarted } from './features/application-startup/NotifyApplicationStarted';
import { NewMemberNicknameChecking } from './features/moderation/nickname-cheking/NewMemberNicknameChecking';
import { UpdatedMemberNicknameChecking } from './features/moderation/nickname-cheking/UpdatedMemberNicknameChecking';

config();

const client = new DiscordClient({
    intents: [
        Intents.FLAGS.DIRECT_MESSAGES,
        Intents.FLAGS.DIRECT_MESSAGE_REACTIONS,
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MESSAGES,
        Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
        Intents.FLAGS.GUILD_EMOJIS_AND_STICKERS,
        Intents.FLAGS.GUILD_BANS,
        Intents.FLAGS.GUILD_INVITES,
        Intents.FLAGS.GUILD_MEMBERS,
    ],
});

client.useFeatures(new NotifyApplicationStarted());

// Moderation
client.useFeatures(
    new NewMemberNicknameChecking(),
    new UpdatedMemberNicknameChecking(),
);

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

    await client.login(readConfigVariable('TOKEN'));
}

initialize().then();
