import { Feature } from '@common/Feature';
import { ClientEvents } from 'discord.js';

export class NotifyApplicationStarted extends Feature {
    readonly trackedEvent: keyof ClientEvents = 'ready';

    async handle(...args: any): Promise<void> {
        console.log('Application successfully started!');
    }
}
