import { getModelForClass, modelOptions, prop } from '@typegoose/typegoose';
import { TimeStamps } from '@typegoose/typegoose/lib/defaultClasses';

@modelOptions({ schemaOptions: { collection: 'Members' } })
class Member extends TimeStamps {
    @prop({ required: true })
    nickname!: string;

    @prop({ default: false })
    banned!: boolean;

    @prop({ default: 0 })
    experiencePoints!: number;
}

export const MemberModel = getModelForClass(Member);
