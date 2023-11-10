var express = require('express');
const bodyParser = require('body-parser');
const twilio = require('../lib/chat');
var router = express.Router();
var dbConn = require('../lib/mice_db');
var emailAction = require('../lib/mailfunc');


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


const hotels = [
    {
        name: 'Hotel A',
        description: 'Lorem ipsum...',
        price: 100,
    },
    {
        name: 'Hotel B',
        description: 'Lorem ipsum...',
        price: 150,
    },
    {
        name: 'Hotel C',
        description: 'Lorem ipsum...',
        price: 120,
    },
    // Add more hotel data here
];

router.get('/', (req, res) => {
    res.render('index', { hotels, title: 'Home' });
}
);


router.use(bodyParser.urlencoded({ extended: false }));

router.get('/blog', (req, res) => {
    res.render('blogs', { title: 'Blog' });
}
);

router.get('/about', (req, res) => {
    res.render('about', { title: 'About' });
}
);

router.get('/contact', (req, res) => {
    res.render('contact', { title: 'About' });
}
);

router.post('/postcontact',(req,res)=>{
    let firstname = req.body.firstname;
    let lastname = req.body.lastname;
    let subject = req.body.subject;
    let email = req.body.email;
    const currentDateTime = getCurrentDateTime();
    let errors = false;
    console.log(firstname,lastname,subject,email);
    var data = {
        firstName:firstname,
        lastName:lastname,
        email:email,
        subject:subject,
        dateSent:currentDateTime
    };
    var insert = 'INSERT INTO mice_tbl_contacts SET ?';
    dbConn.query(insert,data,(err,result)=>{
        if(err){
            req.flash('error', err)
            res.redirect('/');
        }else{
            if(!errors){

                const sendEmail = {
                    from: email,
                    to: 'kenmaha@gmail.com',
                    subject: 'Customer Request',
                    text: '' + subject+'\n\t Contacts: \n\t'+
                    'Name : '+firstname +' '+lastname+'\n\t'+
                    'Email: '+email,

                };
                emailAction.send_mail(sendEmail);

                req.flash('success', 'Thank you for contacing us');
                res.redirect('/');
            }
           
        }
    });
});

router.get('/gallery', (req, res) => {
    res.render('gallery', { title: 'About' });
}
);

router.get('/book/:hotelIndex', (req, res) => {
    const { hotelIndex } = req.params;
    res.render('booking/booking', { hotelIndex });
});

router.post('/book/:hotelIndex/confirm', (req, res) => {
    const { hotelIndex } = req.params;
    const { guestName, checkInDate, checkOutDate } = req.body;

    // Handle booking logic here (store booking data, etc.)

    res.send(`Booking confirmed at ${hotels[hotelIndex].name} for ${guestName}`);
});

router.post('/webhooks/messages', (req, res) => {
    const { Body, From } = req.body;

    // Implement your chatbot logic here
    const response = `You sent: ${Body}`;

    // Send a WhatsApp response
    twilio.sendWhatsAppMessage(From, response);

    res.sendStatus(200);
});


module.exports = router;