import { Client as DiscordClient, ClientOptions } from 'discord.js';

export class Client {
    private static _instance: Client;
    private _discordClientInstance: DiscordClient;

    private constructor(options: ClientOptions) {
        this._discordClientInstance = new DiscordClient(options);
    }

    public static getInstance(clientOptions?: ClientOptions): DiscordClient {
        if (!Client._instance && clientOptions) {
            Client._instance = new Client(clientOptions);
        }

        return Client._instance._discordClientInstance;
    }
}
