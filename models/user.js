import joi from "joi";

const userSchema = joi.object({
    id: joi.string().required(),
    username: joi.string().required(),
    equipment: joi.string().required()
});

export default userSchema;