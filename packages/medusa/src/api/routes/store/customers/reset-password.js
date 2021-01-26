import { MedusaError, Validator } from "medusa-core-utils"
import jwt from "jsonwebtoken"

export default async (req, res) => {
  const schema = Validator.object().keys({
    email: Validator.string()
      .email()
      .required(),
    token: Validator.string().required(),
    password: Validator.string().required(),
  })

  const { value, error } = schema.validate(req.body)
  if (error) {
    throw new MedusaError(MedusaError.Types.INVALID_DATA, error.details)
  }

  try {
    const customerService = req.scope.resolve("customerService")
    let customer = await customerService.retrieveByEmail(value.email)

    const decodedToken = await jwt.verify(value.token, customer.password_hash)
    if (!decodedToken || customer.id !== decodedToken.customer_id) {
      res.status(401).send("Invalid or expired password reset token")
      return
    }

    await customerService.update(customer.id, {
      password: value.password,
    })

    customer = await customerService.retrieve(customer.id)
    res.status(200).json({ customer })
  } catch (error) {
    throw error
  }
}
