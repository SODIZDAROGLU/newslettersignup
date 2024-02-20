const express = require("express");
const bodyParser = require("body-parser");
const request = require ("request");
const https = require('https');



const app = express();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));

app.get("/", function(req, res){
    res.sendFile(__dirname + "/signup.html");
});
app.post("/failure", function(req, res){
    res.redirect("/");
});

app.listen(process.env.PORT || 3000, function(){
    console.log("Server is running on port 3000");
});
app.post("/", function(req,res){
    const firstName = req.body.fName;
    const lastName= req.body.lName;
    const email= req.body.email;
    
    const data = {
        members:[
            {
                email_address:email,
                status:"subscribed",
                merge_fields:{
                    FNAME:firstName,
                    LNAME:lastName,
                }
            }
        ]
    };
    
    //data turn into string
    const jsonData = JSON.stringify(data);
    const url="https://us21.api.mailchimp.com/3.0/lists/89d565538e";
    const options = {
        method: "POST",
        auth:"oz:334534b565887ff03ca08cb84035ffbf-us21",
     
    }
    const request = https.request(url, options, function (response) {
        let responseData = "";

        response.on("data", function (chunk) {
            responseData += chunk;
        });
        //console.log(JSON.parse(responseData));
        var err = false;
        response.on("end", function () {
            const parsedResponse = JSON.parse(responseData);
            const errors = parsedResponse.errors;
            errors.forEach(error => {
                err = error.error;
                console.log("Email Address:", error.email_address);
                console.log("Error:", error.error);
                console.log("Error Code:", error.error_code);
            });
            if (response.statusCode === 200 && !err) {
                res.sendFile(__dirname + "/success.html");
              
            } else {
                res.status(response.statusCode).sendFile(__dirname + "/failure.html");
            }
      
           // console.log(JSON.parse(responseData));
        });
    });

    request.on("error", function (error) {
        console.error("Error while making request to Mailchimp API:", error);
        res.status(500).send("Failed to subscribe. Please try again later.");
    });
            
    
       request.write(jsonData);
       request.end();
    
    });
       

     
         
            



//api key
//ab2e8b7dd662b1ee5e2377c85d88479d-us18
//c5109b66a9




