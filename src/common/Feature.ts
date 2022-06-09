import { ClientEvents } from 'discord.js';

export abstract class Feature {
    abstract readonly trackedEvent: keyof ClientEvents;
    abstract handle(...args: any): Promise<void>;
}
