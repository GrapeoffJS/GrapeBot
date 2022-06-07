import { SlashCommandBuilder } from '@discordjs/builders';
import { Interaction } from 'discord.js';

export class Command {
    constructor(
        public readonly data: SlashCommandBuilder,
        public readonly run: (interaction: Interaction) => Promise<void>,
    ) {}
}
