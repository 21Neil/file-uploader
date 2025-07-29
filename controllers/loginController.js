import { body, validationResult } from 'express-validator';
import passport from 'passport';

const validateLogin = [
  body('email').trim().isEmail().withMessage('Must be an email.').escape(),
  body('password')
    .isLength({ min: 5, max: 50 })
    .withMessage('Password must be between 5 and 50 characters.'),
];

const getLoginView = async (req, res) => {
  res.render('login', {
    title: 'Login',
  });
};

const postLogin = [
  validateLogin,
  (req, res, next) => {
    const errors = validationResult(req).errors;

    if (errors.length !== 0) {
      return res.render('login', {
        title: 'Login',
        ...req.body,
        errors,
      });
    }

    passport.authenticate('local', (err, user, info) => {
      if (err) {
        console.error(err);
        return res.send('Server Error');
      }
      if (info) {
        return res.render('login', {
          title: 'Login',
          ...req.body,
          errors: [{ msg: info.message }],
        });
      }
      if (!user) {
        return res.render('login', {
          title: 'Login',
          ...req.body,
          errors: [{ msg: 'Login fail' }],
        });
      }

      req.logIn(user, err => {
        if (err) return next(err);
        return res.redirect('/');
      });
    })(req, res, next);
  },
];

export { getLoginView, postLogin };
