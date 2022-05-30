const experss = require('express');
const bodyParser = require('body-parser');
const https = require('https');
const dotenv = require('dotenv').config({ debug: true });


const app = experss();
app.use(bodyParser.urlencoded({extended: true }));
app.use(experss.static('public'));


app.get('/', (req, res) => {
    res.sendFile(__dirname + '/singup.html');
});

app.post('/failuer', (req, res) => {
    res.redirect('/');
});


app.post('/', (req, res) => {
    var firstName = req.body.firstName;
    var lastName = req.body.lastName;
    var email = req.body.email;
    // console.log(firstName);
    // console.log(lastName);
    // console.log(email);
    // res.send('Thank you!');

    const url = 'https://us18.api.mailchimp.com/3.0/lists/8ef6d3972a';
    const data = {
        members: [
            {
                email_address: email,
                status: 'subscribed',
                merge_fields: {
                    FNAME: firstName,
                    LNAME: lastName
                }
            }
        ]
    };

    const jsonData = JSON.stringify(data);

    const options = {
        method: 'POST',
        auth: process.env.API_KEY
    };

    const request = https.request(url, options ,(response) => {
        // console.log(response.statusCode);
        // console.log(response.statusMessage);
        if (response.statusCode === 200) {
            res.sendFile(__dirname + '/success.html');
        }
        else {
            res.sendFile(__dirname + '/failure.html');
        }
        response.on('data', (data) => {
            // console.log(JSON.parse(data));
        });
    });
    request.write(jsonData);
    request.end();
});

app.listen(process.env.PORT || 3000, () => {
    console.log('Server started on port 3000');
});