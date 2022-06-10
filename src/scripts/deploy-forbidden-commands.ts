import { FORBIDDEN_NICKNAMES } from '@common/config/forbidden-nicknames';
import { ForbiddenNicknameModel } from '@common/models/forbidden-nickname.model';
import { MongoDBConnectionURIBuilder } from '@common/utils/MongoDBConnectionURIBuilder';
import { readConfigVariable } from '@common/utils/read-config-variable';
import { mongoose } from '@typegoose/typegoose';
import { config } from 'dotenv';

config();

async function deploy() {
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

    for (const forbiddenNickname of FORBIDDEN_NICKNAMES) {
        const doc = new ForbiddenNicknameModel({ nickname: forbiddenNickname });

        try {
            await doc.save();
        } catch {}
    }
}

deploy().then();
