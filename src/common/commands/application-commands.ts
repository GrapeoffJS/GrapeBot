import { Command } from '@common/commands/command';
import { getConfigVariable } from '@common/utils/get-config-variable';
import { REST } from '@discordjs/rest';
import { Collection } from 'discord.js';
import {
    RESTPostAPIApplicationCommandsJSONBody,
    Routes,
} from 'discord-api-types/v10';
import * as fs from 'node:fs';
import path from 'node:path';

export class ApplicationCommands {
    private static _instance: ApplicationCommands;

    private readonly _commands: Collection<string, Command> = new Collection<
        string,
        Command
    >();
    private readonly _commandsBody: RESTPostAPIApplicationCommandsJSONBody[] =
        [];

    private _areCommandsRegistered = false;

    private constructor() {}

    public getAllApplicationCommands() {
        return ApplicationCommands._instance._commands;
    }

    public static async getInstance() {
        if (!ApplicationCommands._instance) {
            ApplicationCommands._instance = new ApplicationCommands();
            await ApplicationCommands.registerAllApplicationCommands();
        }

        return ApplicationCommands._instance;
    }

    private static async registerAllApplicationCommands() {
        if (!ApplicationCommands._instance._areCommandsRegistered) {
            const commandsPath = path.join(process.cwd(), 'dist', 'commands');
            const files = await fs.promises.readdir(commandsPath);

            for (const file of files.filter(file => file.endsWith('.js'))) {
                const filePath = path.join(commandsPath, file);
                const command: Command = await import(filePath);

                ApplicationCommands._instance._commands.set(
                    command.data.name,
                    command,
                );
                ApplicationCommands._instance._commandsBody.push(
                    command.data.toJSON(),
                );

                ApplicationCommands._instance._areCommandsRegistered = true;
            }
        }

        return ApplicationCommands._instance;
    }

    public async deploy() {
        const rest = new REST({ version: '9' }).setToken(
            getConfigVariable('TOKEN'),
        );

        try {
            await rest.put(
                Routes.applicationGuildCommands(
                    getConfigVariable('CLIENT_ID'),
                    getConfigVariable('GUILD_ID'),
                ),
                {
                    body: ApplicationCommands._instance._commandsBody,
                },
            );

            console.info('Commands Successfully Deployed');
        } catch (error) {
            console.error(error);
        }
    }
}
