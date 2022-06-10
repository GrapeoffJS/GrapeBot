import { STRINGS } from '@common/config/strings';
import { Feature } from '@common/Feature';
import { ForbiddenNicknameModel } from '@common/models/forbidden-nickname.model';
import { ClientEvents, GuildMember, MessageEmbed } from 'discord.js';

const { MEMBER_NICKNAME_CHECKING, FOOTER_WATERMARK } = STRINGS.MODERATION;
const { FIELDS, TITLE, URL_TO_RULES } = MEMBER_NICKNAME_CHECKING;

export class NewMemberNicknameChecking extends Feature {
    readonly trackedEvent: keyof ClientEvents = 'guildMemberAdd';

    async handle(member: GuildMember): Promise<void> {
        const forbiddenNickname = await ForbiddenNicknameModel.findOne({
            nickname: member.nickname?.replace(/\s+/g, '').toLowerCase(),
        });

        if (forbiddenNickname) {
            await member.setNickname('[Запрещённый Никнейм]');
            await NewMemberNicknameChecking.warn(member);
        }
    }

    private static async warn(member: GuildMember) {
        const dmChannel = await member.createDM();
        await dmChannel.send({
            embeds: [
                new MessageEmbed()
                    .setColor('RED')
                    .setTitle(TITLE)
                    .addFields([
                        {
                            name: FIELDS.WHAT_HAPPENED.name,
                            value: FIELDS.WHAT_HAPPENED.value,
                        },
                        {
                            name: FIELDS.WHAT_TO_DO.name,
                            value: FIELDS.WHAT_TO_DO.value,
                        },
                        {
                            name: FIELDS.WHAT_IF_REPEAT.name,
                            value: FIELDS.WHAT_IF_REPEAT.value,
                        },
                        {
                            name: FIELDS.WHAT_IF_THERE_IS_A_MISTAKE.name,
                            value: FIELDS.WHAT_IF_THERE_IS_A_MISTAKE.value,
                        },
                    ])
                    .setURL(URL_TO_RULES)
                    .setFooter({ text: FOOTER_WATERMARK }),
            ],
        });
    }
}
