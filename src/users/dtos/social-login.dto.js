import Joi from 'joi'

export default Joi.object().keys({
  providerToken: Joi.string().required(),
  providerId: Joi.string().required(),
  providerType: Joi.string().required().valid('facebook', 'google', 'apple'),
  // platform: Joi.string().required().valid('Android', 'iOS')
})
