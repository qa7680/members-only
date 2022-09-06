const User = require('../models/user');
const { body, validationResult } = require('express-validator');

//GET membership status change 
exports.membership_get = (req, res, next) => {
    //first check if a user is logged in, if not redirect to login page
    if(!res.locals.currentUser){
        return res.redirect('/login')
    }
    res.render('membership', { title: 'Change Membership Status to Expert', user: req.user })
};

//Handle POST membership status change
exports.membership_post = [
    body('membership').trim().escape()
        .custom(async(changeMembership, {req}) => {
            //if user hasn't typed expert, don't change status
            if(changeMembership !== "expert") {
                throw new Error ('type expert');
            }
        }),

        (req, res, next) => {
            const errors = validationResult(req)
            
            if(!errors.isEmpty()) {
                res.render('membership', { title: 'Change Membership Status to Expert', user: req.user });
                return;
            }

            //user typed expert...change users membership status
            User.findByIdAndUpdate(req.user._id, {membership: 'expert'})
                .exec((err, result) => {
                    if(err) {
                        return next(err);
                    }
                    
                    //Successful..redirect to homepage
                    res.redirect('/');
                })
        }
]