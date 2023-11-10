var express = require('express');
var router = express.Router();
var dbConn = require('../lib/mice_db');
var ncry = require('../lib/ncrypt');

router.get('/', async function (req, res, next) {
    try {
        const menuItems = await getMenuItems();
        // console.log(menuItems)   
        //res.setHeader('Content-Type', 'text/html');
        // res.send(htmlContent); // Send the HTML content as a response
        res.render('login');
    } catch (error) {
        console.error('Error fetching menu items:', error);
        res.status(500).send('Internal Server Error');
    }
});

router.post('/auth', async function (req, res, next) {

    let username = req.body.username;
    let password = req.body.password;
    const menuItems = await getMenuItems();
    let errors = false;

    //password = async ncry.hashPassword

    if (username && password) {
        errors = true;
        // Execute SQL query that'll select the account from the database based on the specified username and password
        dbConn.query('SELECT * FROM mice_tbl_users WHERE username = ?', [username], async function (error, results, fields) {
            // If there is an issue with the query, output the error
            if (error) throw error;
            // If the account exists
            if (results.length > 0) {
                console.log(password, results[0].password);
                const isMatch = await ncry.verifyPassword(password, results[0].password);
                if (isMatch) {
                    console.log('Password is correct.');
                    // Authenticate the user
                    req.session.loggedin = true;
                    req.session.username = username;
                    // Redirect to home page
                    res.redirect('/dashboard');
                } else {
                    console.log('Password is incorrect.');
                    req.flash('error', 'Incorrect Password');
                    res.redirect('/login');
                }

            } else {
                errors = true;
                req.flash('error', 'Incorrect Username!');
                res.redirect('/login'); // Redirect to the login page to display the error message
            }
        });
    } else {
        req.flash('error', 'Please enter Username and Password!');
        res.redirect('/'); // Redirect to the login page to display the error message
    }
});



const getMenuItems = () => {
    return new Promise((resolve, reject) => {
        const query = 'SELECT * FROM mice_tbl_menu_items ORDER BY id ASC';
        dbConn.query(query, (err, results) => {
            if (err) {
                reject(err);
            } else {
                resolve(results);
            }
        });
    });
};

module.exports = router;