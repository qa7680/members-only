const Message = require('../models/message');
const { body, validationResult } = require('express-validator');

//Display message create form GET
exports.create_message_get = (req, res) => {
    //first check if a user is logged in, if not redirect to login page
    if(!res.locals.currentUser){
        return res.redirect('/login')
    }
    res.render('message', { title: 'New Message', user: req.user })
};

//Handle message create form POST
exports.create_message_post = [
    //Validate and sanitize our input fields
    body('title').trim().isLength({ min: 3 }).escape().withMessage('Title must be at least 3 characters long.'),
    body('message').trim().isLength({ min: 3 }).escape().withMessage('Message must be at least 3 characters long.'),

    (req, res, next) => {
        //Extract the errors
        const errors = validationResult(req);

        if(!errors.isEmpty()) {

            res.render('message', {
                title: 'New Message',
                errors: errors.array(),
                message: req.body,
                user: req.user
            })
            return;
        }

        //Data valid...save message
        const message = new Message(
            {
                title: req.body.title,
                message: req.body.message,
                time: req.body.time,
                user: req.user._id
            }
        ).save((err) => {
            if (err) return next(err);
            
            res.redirect('/');
        })
    }
];

//Delete message POST handle
exports.delete_message_post = (req, res, next) => {
    //find message id in DB and delete
    Message.findByIdAndRemove(req.body.message_Id).exec((err) => {
        if(err) return next(err);
        res.redirect('/');
    })
};