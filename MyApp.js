var express = require('express')
var http = require('http');
var app = express();
var server = http.createServer(app);
var port = process.env.PORT || 3000;
var VK = require('vksdk.js');


var vk = new VK({
    'appID'     : 4082072,
    'appSecret' : 'ovZNCO262q8WyLUhmCIR',
    'mode'      : 'sig'
});

 vk.request('getProfiles', {'uids' : '8857627'});
    // и так далее...
    vk.on('done:getProfiles', function(_o) {
        console.log(_o);
      var  username = _o['response'][0]['first_name'];
        alert(username);
    });


server.listen(port, function() {
   console.log('Listening on ' + port);
});


app.use(express.static(__dirname + '/public'));

var io = require('socket.io').listen(server);

io.configure(function () {
   io.set("transports", ["xhr-polling"]);
   io.set("polling duration", 10);
});

io.sockets.on('connection', function (socket) {
   socket.emit('news', { hello: 'world' });
   socket.on('my other event', function (data) {
      console.log(data);
   });
});

var mongo = require('mongoskin');
var conn = mongo.db('mongodb://venom-lp:spider11@dharma.mongohq.com:10001/nodeJSDataBase');


app.get('/', function (request, response)
{
   response.sendfile(__dirname + '/index.html');
   
   var ip = request.connection.remoteAddress;
   var user = {ipAddress: ip, dateConnection: new Date()};

    conn.collection('collectionName').findOne(
    {
      ipAddress:user.ipAddress
    },
    function(err, doc)
    {
    if (err) { /* something is wrong */ }
    if (doc) //если пользователь есть, то обновляем
     {  console.log("updated  ");
         conn.collection('collectionName').update(
        {
            ipAddress:user.ipAddress
        },
        {
   
            date: user.dateConnection
            
        },
        {
            
         upsert:true
        });
     }
     else //если нет, то создаем
     {
         conn.collection('collectionName').insert(user, {safe: true}, function(err, records){
        console.log("Record added  ");
         });
     }
});
   
});

