import { FORBIDDEN_NICKNAMES } from '@common/config/forbidden-nicknames';
import { Feature } from '@common/Feature';
import { createLinkToChannel } from '@common/utils/create-link-to-channel';
import { ClientEvents, GuildMember, MessageEmbed } from 'discord.js';

export class UpdatedMemberNicknameChecking extends Feature {
    readonly trackedEvent: keyof ClientEvents = 'guildMemberUpdate';

    async handle(
        oldMember: GuildMember,
        newMember: GuildMember,
    ): Promise<void> {
        if (
            FORBIDDEN_NICKNAMES.includes(
                newMember.nickname
                    ? newMember.nickname
                          .toLowerCase()
                          .trim()
                          .replace(/\s+/g, '')
                    : '',
            )
        ) {
            try {
                await UpdatedMemberNicknameChecking.warn(newMember);
                await newMember.setNickname(oldMember.nickname);
            } catch (error) {
                console.log(error);
            }
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
                            value: 'Вы только что поменяли свой никнейм на недопустимый на этом сервере. Сейчас ваш никнейм сменён на ваш предыдущий.',
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
