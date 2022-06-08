import { prop } from '@typegoose/typegoose';
import { TimeStamps } from '@typegoose/typegoose/lib/defaultClasses';

export class MemberModel extends TimeStamps {
    @prop({ required: true })
    nickname!: string;

    @prop({ default: false })
    banned!: boolean;

    @prop({ default: 0 })
    experiencePoints!: number;
}
