import { Command } from '@common/Command';
import { Feature } from '@common/Feature';
import { readConfigVariable } from '@common/utils/read-config-variable';
import { REST } from '@discordjs/rest';
import { Client, ClientOptions, Collection } from 'discord.js';
import { Routes } from 'discord-api-types/v10';

export class DiscordClient {
    private readonly _client: Client;
    private readonly _features: Feature[] = [];
    private readonly _commands: Collection<string, Command> = new Collection<
        string,
        Command
    >();

    constructor(clientOptions: ClientOptions) {
        this._client = new Client(clientOptions);
    }

    public async login(token: string) {
        await this.registerFeatures();

        await this._client.login(token);
    }

    public useFeatures(...features: Feature[]) {
        for (const feature of features) {
            this._features.push(feature);
        }
    }

    public useCommand(commandKey: string, command: Command) {
        this._commands.set(commandKey, command);
    }

    private async registerFeatures() {
        for (const feature of this._features) {
            this._client.on(feature.trackedEvent, feature.handle);
        }
    }

    private async registerCommands() {
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
                    body: this._commands.map(command => command.data.toJSON()),
                },
            );
        } catch (error) {
            console.error(error);
        }
    }
}
