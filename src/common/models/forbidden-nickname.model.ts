import { getModelForClass, modelOptions, prop } from '@typegoose/typegoose';

@modelOptions({ schemaOptions: { collection: 'ForbiddenNicknames' } })
class ForbiddenNickname {
    @prop({ unique: true })
    nickname!: string;
}

export const ForbiddenNicknameModel = getModelForClass(ForbiddenNickname);
