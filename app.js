const express = require("express");
const bodyParser = require("body-parser");
const request = require ("request");
 

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
    const url="https://us18.api.mailchimp.com/3.0/lists/c5109b66a9";
    const options = {
        method: "POST",
        auth:"oz:ab2e8b7dd662b1ee5e2377c85d88479d-us18"
    }
    const request = https.request(url, options, function(response){

           if( response.statusCode === 200){
               res.sendFile(__dirname + "/success.html");
           } else {
               res.send(res.sendFile + "/failure.html");
           }
           response.on("data", function(data){
               console.log(JSON.parse(data));
           });
    });
    request.write(jsonData);
    request.end();
});
//api key
//ab2e8b7dd662b1ee5e2377c85d88479d-us18

//c5109b66a9
