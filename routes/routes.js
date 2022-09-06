const express = require('express');
const router = express.Router();

//require controller modules.
const home_controller = require('../controllers/homepageController');
const user_controller = require('../controllers/userController');
const message_controller = require('../controllers/messageController');
const membership_controller = require('../controllers/membershipController');

// ALL OF OUR ROUTES

// homepage -->    '/' , shows all messages in time descending order
router.get('/', home_controller.message_list);

//POST request for message delete
router.post('/', message_controller.delete_message_post);

// login --> '/log-in'

//GET request for log in
router.get('/login', user_controller.user_login_get);

//POST request for log in
router.post('/login', user_controller.user_login_post);

//logout
router.get('/logout', user_controller.user_logout_get);

// sign-up --> '/sign-up'

//GET request for sign up
router.get('/sign-up', user_controller.user_signup_get);

//POST request for sign up
router.post('/sign-up', user_controller.user_signup_post);

// create message --> 'create-message'

//GET request for create message
router.get('/create-message', message_controller.create_message_get);

//POST request for create message
router.post('/create-message', message_controller.create_message_post);


//membership status --> 'membership'

//GET request for membership change
router.get('/membership', membership_controller.membership_get);

//POST request for membership change
router.post('/membership', membership_controller.membership_post);

module.exports = router;


