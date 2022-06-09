import { FORBIDDEN_NICKNAMES } from '@common/config/forbidden-nicknames';
import { Feature } from '@common/Feature';
import { createLinkToChannel } from '@common/utils/create-link-to-channel';
import { ClientEvents, GuildMember, MessageEmbed } from 'discord.js';

export class NewMemberNicknameChecking extends Feature {
    readonly trackedEvent: keyof ClientEvents = 'guildMemberAdd';

    async handle(member: GuildMember): Promise<void> {
        if (
            FORBIDDEN_NICKNAMES.includes(
                member.nickname
                    ? member.nickname.toLowerCase().trim().replace(/\s+/g, '')
                    : '',
            )
        ) {
            await NewMemberNicknameChecking.warn(member);
            await member.setNickname('[Запрещённый Никнейм]');
        }
    }

    private static async warn(member: GuildMember) {
        const dmChannel = await member.createDM();
        await dmChannel.send({
            embeds: [
                new MessageEmbed()
                    .setColor('#fc4b4b')
                    .setTitle('Вы нарушаете правила сервера!')
                    .addFields([
                        {
                            name: 'Что произошло?',
                            value: 'Ваш никнейм недопустим на данном сервере и был сменён на временный.',
                        },
                        {
                            name: 'Что нужно сделать?',
                            value: 'Вы должны сменить ваш текущий никнейм в соответствии с правилами из пункта "Ники и Аватарки" правил сервера.',
                        },
                        {
                            name: 'Что будет при повторных нарушениях?',
                            value: 'Вы будете выгнаны с сервера на несколько дней. Если подобное поведение продолжится после второго присоединения, вы получите бан.',
                        },
                        {
                            name: 'Что делать, если предупреждение получено по ошибке?',
                            value: 'Вам нужно обратиться к администрации сервера и объяснить ситуацию. Если ошибочное срабатывание будет доказано, с вас снимут предупреждение.',
                        },
                    ])
                    .setURL(createLinkToChannel('RULES_CHANNEL_ID'))
                    .setFooter({ text: 'Система модерации GrapeCode++' }),
            ],
        });
    }
}
