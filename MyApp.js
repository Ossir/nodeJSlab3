var express = require('express')
var http = require('http');
var app = express();
var server = http.createServer(app);
var port = process.env.PORT || 3000;

var ip;
var id;

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
  // socket.emit('news', { hello: 'world' });
   socket.on('vkID', function(name) {

 id = name;

  });
  
   socket.on('score', function (score) {
        socket.emit('saved', 'here');
         var user = {vkontakteID: id ,  ipAddress: ip, dateConnection: new Date(), clickScore:score};
         
    conn.collection('collectionName').findOne(
    {
      vkontakteID:user.vkontakteID
    },
    function(err, doc)
    {
    if (err) {  socket.emit('warning', 'YES');}
    if (doc) //если пользователь есть, то обновляем
     {  
        
         conn.collection('collectionName').update(
        {
             vkontakteID:user.vkontakteID
        },
        {
   
           $set: {updated_at: new Date()}
            
        },
        {
            
         upsert:true
        });
     }
     else //если нет, то создаем
     {
         conn.collection('collectionName').insert(user, {safe: true}, function(err, records){
       ////console.log("Record added  ");
       socket.emit('saved', 'YES');
         });
     }
});
       
      
   });
});

var mongo = require('mongoskin');
var conn = mongo.db('mongodb://venom-lp:spider11@dharma.mongohq.com:10001/nodeJSDataBase');


app.get('/', function (request, response)
{
   response.sendfile(__dirname + '/index.html');
   
   ip = request.connection.remoteAddress;
  // var user = {ipAddress: ip, dateConnection: new Date()};


   
});

