import { Client } from '@common/client';

Client.getInstance().on('ready', () => {
    console.log('Client is Ready');
});
