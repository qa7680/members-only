const User = require('../models/user');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const passport = require('passport');

//Display sign up form on GET
exports.user_signup_get = (req, res) => {
    if(res.locals.currentUser){
        return res.redirect('/')
    };
    res.render('signup', { title: 'Sign Up Form'})
};

//Display sign up form on POST
exports.user_signup_post = [
    //Validate and sanitize all of our input fields.
    body('first_name').trim().isLength({ min: 1 }).escape().withMessage('First name required'),
    body('last_name').trim().isLength({ min: 1 }).escape().withMessage('Last name required'),
    body('username').trim().isLength({ min: 5}).escape().withMessage('Username must be at least 5 characters.'),
    body('password').trim().isLength({ min:6 }).escape().withMessage('Password must be at least 6 characters'),
    body('password2').trim().isLength({ min:6 }).escape().withMessage('Password must be at least 6 characters')
        //Custom validator to check if passwords match
        .custom(async(confirmPassword, {req}) => {
            const password = req.body.password
            //if password and password2(confirmPassword) are not the same, don't allow the user to sign up and throw error
            if(password !== confirmPassword){
                throw new Error('Passwords do not match')
            }
        }),

    (req, res, next) => {
        //Extract the errors
        const errors = validationResult(req);

        if(!errors.isEmpty()) {
            res.render('signup', {
                title: 'Sign up form',
                user: res.locals.currentUser,
                reqBody: req.body,
                errors: errors.array()
            })
            return;
        }
        
        //Data from form is valid. Save user.
        //Check if User with same name already exsits.
        User.findOne({username: req.body.username}).exec((err, found_user) => {
            if(err) {
                return next(err);
            }

            if(found_user) {
                res.render('signup', {
                    title: 'Sign up form',
                    userExists: 'Username already exists',
                    reqBody: req.body
                })
            } else{
                //Create a User object with escaped and trimmed data.
                //Also hash passwords with bcrypt
        bcrypt.hash(req.body.password, 10, (err, hashedPassword) => {
            if(err) return next(err);
            // otherwise, store hashedPassword in DB
            const user = new User(
                {
                    first_name: req.body.first_name,
                    last_name: req.body.last_name,
                    username: req.body.username,
                    password: hashedPassword,
                    membership: req.body.membership,
                    admin: req.body.admin == undefined ? false : true,
                    emoji: req.body.emoji
                }
            ).save((err) => {
                if(err) return next(err);       
                res.redirect('/login');
            })
          });
            }
        })
    }
];

//Display login form on GET
exports.user_login_get = (req, res) => {
    if(res.locals.currentUser){
        return res.redirect('/')
    };
    res.render('login', { title: 'Login'})
};

//Handle login form on POST
exports.user_login_post = passport.authenticate("local", {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true
});

//log out 
exports.user_logout_get = (req, res) => {
    req.logout((err) => {
        if(err) {
            return next(err);
        }
        res.redirect('/');
    })
};