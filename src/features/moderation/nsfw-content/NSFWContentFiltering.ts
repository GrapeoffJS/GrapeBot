import { STRINGS } from '@common/config/strings';
import { Feature } from '@common/Feature';
import { readConfigVariable } from '@common/utils/read-config-variable';
import { node, Tensor3D } from '@tensorflow/tfjs-node';
import axios from 'axios';
import {
    ClientEvents,
    Message,
    MessageAttachment,
    MessageEmbed,
} from 'discord.js';
import { load, predictionType } from 'nsfwjs';

const { NSFW_CONTENT_FILTERING, FOOTER_WATERMARK } = STRINGS.MODERATION;
const { FIELDS, TITLE } = NSFW_CONTENT_FILTERING;

export class NSFWContentFiltering extends Feature {
    readonly trackedEvent: keyof ClientEvents = 'messageCreate';

    async handle(message: Message): Promise<void> {
        const imageAttachments = message.attachments
            .filter(
                attachment =>
                    attachment.contentType !== null &&
                    attachment.contentType.startsWith('image'),
            )
            .map(attachment => attachment);

        const shouldDelete = NSFWContentFiltering.shouldDelete(
            await NSFWContentFiltering.analyze(imageAttachments),
        );

        if (shouldDelete) {
            await message.delete();
            await message.channel.send({
                embeds: [
                    new MessageEmbed()
                        .setColor('ORANGE')
                        .setTitle(TITLE)
                        .addFields([
                            {
                                name: FIELDS.WHAT_HAPPENED.name,
                                value: FIELDS.WHAT_HAPPENED.value(
                                    message.author.id,
                                ),
                            },
                            {
                                name: FIELDS.WHATS_NEXT.name,
                                value: FIELDS.WHATS_NEXT.value,
                            },
                            {
                                name: FIELDS.SUPPORT.name,
                                value: FIELDS.SUPPORT.value,
                            },
                        ])
                        .setFooter({ text: FOOTER_WATERMARK }),
                ],
            });
        }
    }

    private static async analyze(imageAttachments: MessageAttachment[]) {
        const analysisResults: predictionType[][] = [];
        const model = await load();

        for (const attachment of imageAttachments) {
            const picture = await axios.get(attachment.url, {
                responseType: 'arraybuffer',
            });
            const decodedImage = await node.decodeImage(picture.data, 3);

            analysisResults.push(
                await model.classify(decodedImage as Tensor3D),
            );

            decodedImage.dispose();
        }

        return analysisResults;
    }

    private static shouldDelete(analysisResults: predictionType[][]) {
        const total = [];

        for (const results of analysisResults) {
            const nsfwProbabilities = results
                .filter(
                    result =>
                        result.className === 'Hentai' ||
                        result.className === 'Sexy' ||
                        result.className === 'Porn',
                )
                .map(result => result.probability)
                .filter(
                    probability =>
                        probability >=
                        Number(readConfigVariable('NSFW_THRESHOLD')),
                );

            total.push(...nsfwProbabilities);
        }

        return total.length > 0;
    }
}
