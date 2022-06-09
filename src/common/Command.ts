import { SlashCommandBuilder } from '@discordjs/builders';
import { Interaction } from 'discord.js';

export abstract class Command {
    abstract readonly data: SlashCommandBuilder;
    abstract run(interaction: Interaction): Promise<void>;
}
