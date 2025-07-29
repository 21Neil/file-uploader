import { body, validationResult } from 'express-validator';
import bcrypt from 'bcryptjs';
import { createUser, getUserByUsername } from '../prisma/queries.js';

const alphaErr = 'must only contain letters.';
const lengthErr = 'must be between 1 and 50 characters.';

const validateUser = [
  body('firstName')
    .trim()
    .isAlpha()
    .withMessage('First name ' + alphaErr)
    .isLength({ min: 1, max: 50 })
    .withMessage('First name ' + lengthErr)
    .escape(),
  body('lastName')
    .trim()
    .isAlpha()
    .withMessage('Last name ' + alphaErr)
    .isLength({ min: 1, max: 50 })
    .withMessage('Last name ' + lengthErr)
    .escape(),
  body('email')
    .trim()
    .isEmail()
    .withMessage('Must be an email.')
    .escape(),
  body('password')
    .isLength({ min: 5, max: 50 })
    .withMessage('Password must be between 5 and 50 characters.'),
  body('confirmPassword')
    .custom((value, { req }) => {
      return value === req.body.password;
    })
    .withMessage('Password do not match.'),
];

const getSignupView = async (req, res) => {
  res.render('signup', {
    title: 'Sign up',
  });
};

const postSignup = [
  validateUser,
  async (req, res, next) => {
    const errors = validationResult(req).errors;

    if (errors.length !== 0) {
      return res.render('signup', {
        title: 'Sign up',
        errors,
        ...req.body,
      });
    }

    try {
      const { firstName, lastName, email, password } = req.body;
      const isExisting = await getUserByUsername(email);

      if (isExisting)
        return res.render('signup', {
          title: 'Sign up',
          errors: [{ msg: 'Email has been used' }],
          ...req.body,
        });

      const hashedPassword = await bcrypt.hash(password, 10);

      await createUser(firstName, lastName, email, hashedPassword);

      res.redirect('/');
    } catch (err) {
      next(err);
    }
  },
];

export { getSignupView, postSignup };
