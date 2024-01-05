var express = require('express');
var router = express.Router();
var dbConn = require('../library/mice_db');
const passwordUtils = require('../library/ncrypt');
const emailSender = require('../library/mailfunc');

// display user page
router.get('/', async function (req, res, next) {
    const menuItems = await getMenuItems();
    const sql = 'SELECT * FROM mice_tbl_staffs s INNER JOIN mice_tbl_users u ON u.emp_id= s.staffId JOIN mice_tbl_roles r ON r.roleId=s.roleId ';
    dbConn.query(sql, function (err, rows) {
        if (err) {
            req.flash('error', err);
            // render to views/users/index.ejs
            res.render('users/users', { data: '', title: 'Users', menuItems });
        } else {

            // render to views/users/index.ejs
            res.render('users/users', { data: rows, formatDate, title: 'Users', menuItems });
        }
    });
});



// display add user page
router.get('/add', async function (req, res, next) {
    // render to add.ejs
    const menuItems = await getMenuItems();
    res.render('users/add_user', {
        username: '',
        middleName: '',
        password: '',
        email: '',
        role: '',
        title: 'Users', menuItems
    })
})

// Function to format the date
function formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

function getCurrentDateTime() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');

    const formattedDateTime = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    return formattedDateTime;
}


// add a new user
router.post('/add', async function (req, res, next) {

    let username = req.body.username;
    let password = req.body.password;
    let email = req.body.email;
    let role = req.body.role;

    const currentDateTime = getCurrentDateTime();
    const menuItems = await getMenuItems();

    let errors = false;

    if (username.length === 0 || password.length === 0 || email.length === 0 || role.length === 0) {
        errors = true;

        // set flash message
        req.flash('error', "Please enter name and email and position");
        // render to add.ejs with flash message
        res.render('users/add_user', {
            username: username,
            password: password,
            email: email,
            role: role,
            title: 'Add User', menuItems
        })
    }

    // if no error
    if (!errors) {

        var form_data = {
            username: username,
            password: password,
            email: email,
            role: role,
            lastLoginTime: currentDateTime
        }

        // insert query
        dbConn.query('INSERT INTO mice_tbl_users SET ?', form_data, function (err, result) {
            //if(err) throw err
            if (err) {
                req.flash('error', err)

                // render to add.ejs
                res.render('users/add_user', {
                    username: form_data.username,
                    password: form_data.password,
                    email: form_data.email,
                    role: form_data.role,
                    title: 'Add User', menuItems
                })
            } else {
                req.flash('success', 'User successfully added');
                res.redirect('/users');
            }
        })
    }
})

// display edit user page
router.get('/edit/(:id)', async function (req, res, next) {

    let id = req.params.id;
    const menuItems = await getMenuItems();
    dbConn.query('SELECT * FROM mice_tbl_users WHERE user_id  = ' + id, function (err, rows, fields) {
        if (err) throw err

        // if user not found
        if (rows.length <= 0) {
            req.flash('error', 'User not found with id = ' + id)
            res.redirect('/users')
        }
        // if user found
        else {
            // render to edit.ejs
            res.render('users/edit_user', {
                title: 'Edit User',
                id: rows[0].user_id,
                username: rows[0].username,
                password: rows[0].password,
                email: rows[0].email,
                role: rows[0].role,
                title: 'Add User', menuItems
            })
        }
    })
})

// update user data
router.post('/update/:id', async function (req, res, next) {

    let id = req.params.id;
    let username = req.body.username;
    let password = req.body.password;
    let email = req.body.email;
    let role = req.body.role;
    const currentDateTime = getCurrentDateTime();
    const menuItems = await getMenuItems();
    let errors = false;

    if (username.length === 0 || password.length === 0 || email.length === 0) {
        errors = true;

        // set flash message
        req.flash('error', "Please respective data");
        // render to add.ejs with flash message
        res.render('users/edit_user', {
            user_id: req.params.id,
            username: username,
            password: password,
            email: email,
            role: role,
            title: 'Add User', menuItems
        })
    }

    // if no error
    if (!errors) {

        var form_data = {
            username: username,
            password: password,
            email: email,
            role: role,
            lastUpdate: currentDateTime
        }
        // update query
        dbConn.query('UPDATE mice_tbl_users SET ? WHERE user_id = ' + id, form_data, function (err, result) {
            //if(err) throw err
            if (err) {
                // set flash message
                req.flash('error', err)
                // render to edit.ejs
                res.render('users/edit_user', {
                    user_id: req.params.id,
                    username: form_data.username,
                    password: form_data.password,
                    email: form_data.email,
                    role: form_data.role,
                    title: 'Add User', menuItems
                })
            } else {
                req.flash('success', 'User successfully updated');
                res.redirect('/users');
            }
        })
    }
})

// delete user
router.get('/delete/(:id)', function (req, res, next) {

    let id = req.params.id;

    dbConn.query('DELETE FROM mice_tbl_users WHERE user_id = ' + id, function (err, result) {
        //if(err) throw err
        if (err) {
            // set flash message
            req.flash('error', err)
            // redirect to user page
            res.redirect('/users')
        } else {
            // set flash message
            req.flash('success', 'User successfully deleted! ID = ' + id)
            // redirect to user page
            res.redirect('/users')
        }
    })
})

router.get('/fogotpass', function (req, res, next) {

    res.render('users/fogotpassword');

});

router.post('/procfpass', function (req, res, next) {
    let email = req.body.email;

    console.log(email);
    const sql = 'SELECT * FROM mice_tbl_users WHERE email = ? ';
    dbConn.query(sql, [email], function (err, rows, fields) {
        if (err) {
            req.flash('error', err);
            res.render('users/fogotpassword');
        } else {
            if (rows.length > 0) {
                console.log(rows[0].username);

                // Define email data
                const mailOptions = {
                    from: 'amahakennedy@gmail.com',
                    to: 'kenmaha@gmail.com',
                    subject: 'Test',
                    text: 'This is the email content.'
                };

                const sendEmail = {
                    from: 'amahakennedy@gmail.com',
                    to: 'kenmaha@gmail.com',
                    subject: 'PASSWORD RESET',
                    text: 'Please follow the below link to reset your password'+
                     'http://https://onesolidlink.com/users/resetpass/' + rows[0].user_id,

                };

                emailSender.send_mail(sendEmail);
                req.flash('success', "Reset Link sent to your email");
                res.render('login');

            } else {
                req.flash('error', "User does not exist!!");
                res.render('users/fogotpassword');
                return;
            }
        }
    })
});

router.get('/resetpass/(:id)', function (req, res, next) {
    let id = req.params.id;
    res.render('users/resetpass', {
        id: id,
        password: '',
        cpassword: '',
    })
});

router.post('/reset/:id', async function (req, res, next) {
    let id = req.params.id;
    let password = req.body.password;
    let cpassword = req.body.cpassword;
    const currentDateTime = getCurrentDateTime();
    let errors = false;

    if (password !== cpassword) {
        req.flash('error', "Passwords Don't Match");
        res.render('users/resetpass', {
            id: id,
            password: password,
            cpassword: cpassword
        });
        return;
    }
    if (!errors) {
        const pass = await passwordUtils.hashPassword(password);
        var form_data = {
            password: pass,
            lastUpdate: currentDateTime
        }
        // update query
        dbConn.query('UPDATE mice_tbl_users SET ? WHERE user_id = ' + id, form_data, function (err, result) {
            //if(err) throw err
            if (err) {
                // set flash message
                req.flash('error', err)
                // render to edit.ejs
                res.render('users/resetpass', {
                    id: req.params.id,
                    password: password,
                    cpassword: cpassword
                })
            } else {
                req.flash('success', 'Password reset successfully');
                res.redirect('/login');
            }
        });
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