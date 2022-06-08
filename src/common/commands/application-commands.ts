import { Command } from '@common/commands/command';
import { readConfigVariable } from '@common/utils/read-config-variable';
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

    public getCommand(name: string) {
        return this._commands.get(name);
    }

    public static getInstance() {
        if (!ApplicationCommands._instance) {
            ApplicationCommands._instance = new ApplicationCommands();
        }

        return ApplicationCommands._instance;
    }

    public async registerAllApplicationCommands() {
        if (!this._areCommandsRegistered) {
            const commandsPath = path.join(process.cwd(), 'dist', 'commands');
            const files = await fs.promises.readdir(commandsPath);

            for (const file of files.filter(file => file.endsWith('.js'))) {
                const filePath = path.join(commandsPath, file);
                const command: Command = await import(filePath);

                this._commands.set(command.data.name, command);
                this._commandsBody.push(command.data.toJSON());

                this._areCommandsRegistered = true;
            }
        }

        return this;
    }

    public async deploy() {
        const rest = new REST({ version: '9' }).setToken(
            readConfigVariable('TOKEN'),
        );

        try {
            await rest.put(
                Routes.applicationGuildCommands(
                    readConfigVariable('CLIENT_ID'),
                    readConfigVariable('GUILD_ID'),
                ),
                {
                    body: this._commandsBody,
                },
            );

            console.info('Commands Successfully Deployed');
        } catch (error) {
            console.error(error);
        }
    }
}
