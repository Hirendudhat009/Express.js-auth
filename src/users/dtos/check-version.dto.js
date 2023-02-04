import Joi from 'joi'

export default Joi.object().keys({
  platform: Joi.string().required(),
  version: Joi.string().required(),
})
