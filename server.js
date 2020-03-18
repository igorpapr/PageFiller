let fs = require('fs');
let express = require('express');
let server = express();
const bodyParser = require("body-parser");
const path = __dirname + '/res/articles.json';


const urlencodedParser = bodyParser.urlencoded({extended: false});

server.listen(8888);
console.log('Server is running on port 8888');

server.use(express.static(__dirname));
const jsonParser = bodyParser.json();


server.get('/', function(req, res){
    res.sendFile(__dirname+"/src/index.html");
});

server.get('/admin', function(req, res){
    res.sendFile(__dirname+"/src/admin.html");
});


server.post('/addarticle', urlencodedParser, async function(req, res){
    let title = req.body.title;
    let artBody = req.body.message;
    console.log(req.body);
    console.log(artBody);
    let article = {title: title, body: artBody};
    await writeToTheEndData(path,article).then(
        result => {

            res.redirect('/admin')},
        error => {
            res.writeHead(400);
        });
    res.end();
});

server.get('/getArticles', async function(req, res){
    res.writeHead(200,{"Content-type": "text/plain; charset=utf-8"});
    await getData(path).then(
        result => {
            res.write(result);
            },
        error => {
            res.write(error.message)});
    res.end();
});

async function getData(resource) {
    return new Promise((resolve, reject) => {
        fs.readFile(resource, 'utf8', (err, jsonString) => {
            if (err) {
                reject(err);
            }
            else{
                resolve(jsonString);
            }
        })
    });
}

async function writeToTheEndData(resource, data) {
    return new Promise((resolve, reject) => {
        fs.readFile(resource, 'utf8', (err, jsonString) => {
            if (err) {
                reject(err);
            }
            else{
                try{
                    let prevDataObj = JSON.parse(jsonString);
                        prevDataObj.push(data);
                        let datatowrite = JSON.stringify(prevDataObj);
                        fs.writeFileSync(resource,datatowrite,'utf8');
                        resolve(true);
                }
                catch (e) {
                    reject(e);
                }
            }
        })
    });
}