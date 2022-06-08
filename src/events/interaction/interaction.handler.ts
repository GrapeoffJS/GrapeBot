import { Client } from '@common/client';
import { ApplicationCommands } from '@common/commands/application-commands';
import { ERRORS } from '@common/config/errors';

Client.getInstance().on('interactionCreate', async interaction => {
    if (!interaction.isCommand()) return;

    const command = await ApplicationCommands.getInstance().getCommand(
        interaction.commandName,
    );

    if (!command) return;

    try {
        await command.run(interaction);
    } catch {
        await interaction.reply({
            content: ERRORS.INTERACTION_ERROR,
            ephemeral: true,
        });
    }
});
