import { Client } from '@common/client';
import { FORBIDDEN_NICKNAMES } from '@common/config/forbidden-nicknames';
import { createLinkToChannel } from '@common/utils/create-link-to-channel';
import { readConfigVariable } from '@common/utils/read-config-variable';
import { hyperlink } from '@discordjs/builders';
import { GuildMember } from 'discord.js';

const warnMember = async (member: GuildMember) => {
    const dmChannel = await member.createDM();

    await member.setNickname('[Запрещённый Никнейм]');
    await dmChannel.send(`
            Ваш никнейм не прошёл проверку и был сменён на временный. 
            Пожалуйста, поменяйте его на новый в соответствии с ${hyperlink(
                'правилами',
                createLinkToChannel(readConfigVariable('RULES_CHANNEL_ID')),
            )} из секции "Ники и аватарки". 
            
            Помните, что повторные предупреждения повлекут за собой бан вашего аккаунта на сервере.
            Также стоит заметить, что даже если вам удастся обойти систему проверки никнеймов, вы всё-равно рано или поздно получите предупреждение или бан, но уже от администрации сервера.
        `);
};

Client.getInstance().on('guildMemberAdd', async member => {
    if (
        FORBIDDEN_NICKNAMES.includes(
            member.nickname
                ? member.nickname.toLowerCase().trim().replace(/\s+/g, '')
                : '',
        )
    ) {
        await warnMember(member);
    }
});

Client.getInstance().on('guildMemberUpdate', async member => {
    if (
        FORBIDDEN_NICKNAMES.includes(
            member.nickname
                ? member.nickname.toLowerCase().trim().replace(/\s+/g, '')
                : '',
        )
    ) {
        await warnMember(member as GuildMember);
    }
});
