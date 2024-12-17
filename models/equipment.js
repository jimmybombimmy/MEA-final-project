import joi from "joi";

const userSchema = joi.object({
    id: joi.string().required(),
    name: joi.string().required(),
    amount: joi.number().required()
});

export default userSchema;