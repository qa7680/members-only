const Message = require('../models/message');
const User = require('../models/user');

//Display all messages
exports.message_list = (req, res, next) => {
    Message.find({})
        .sort([["time", "descending"]])
        .populate('user')
        .exec((err, list_messages) => {
            if(err) return next(err);
            //Successful, so render
            res.render('homepage', { title: 'All messages', message_list: list_messages, user: req.user });
        })
};

