import Joi from "joi";

const changePasswordSchema = Joi.object({
  currentPassword: Joi.string().min(6).required().messages({
    "string.base": "Current password must be a string.",
    "string.empty": "Current password is required.",
    "string.min": "Current password must be at least 6 characters long.",
    "any.required": "Current password is required.",
  }),

  newPassword: Joi.string().min(6).required().messages({
    "string.base": "New password must be a string.",
    "string.empty": "New password is required.",
    "string.min": "New password must be at least 6 characters long.",
    "any.required": "New password is required.",
  }),

  confirmNewPassword: Joi.any()
    .valid(Joi.ref("newPassword"))
    .required()
    .messages({
      "any.only": "Confirm new password must match the new password.",
      "any.required": "Confirm new password is required.",
    }),
});

export default changePasswordSchema;
