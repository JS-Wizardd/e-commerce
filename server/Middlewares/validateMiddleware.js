import { validationResult, body } from 'express-validator'

export const validateRegisterInput = [
  //Validation rules for email
  body('email').isEmail().withMessage('Email is required').normalizeEmail(),

  body('password')
    .isLength({ min: 6, max: 16 })
    .withMessage('Password should be between 6 and 16 characters ')
    .matches(/^(?=.*\d)(?=.*[a-zA-Z])[a-zA-Z0-9]{6,16}$/)
    .withMessage('Password should be a combination of letter and number'),

  (req, res, next) => {
    const error = validationResult(req)
    if (!error.isEmpty()) {
      return res.status(400).json({ errors: error.array() })
    }
    next()
  },
]
