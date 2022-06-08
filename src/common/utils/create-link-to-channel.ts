// https://discord.com/channels/982042480067366992/982350196845473813

import { readConfigVariable } from '@common/utils/read-config-variable';

export const createLinkToChannel = (channelId: string) => {
    return `https://discord.com/channels/${readConfigVariable(
        'GUILD_ID',
    )}/${channelId}`;
};
