var express = require('express')
var http = require('http');
var app = express();
var server = http.createServer(app);
var port = process.env.PORT || 3000;

server.listen(port, function() {
   console.log('Listening on ' + port);
});

app.get('/', function (request, response) {
   response.sendfile(__dirname + '/index.html');
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

conn.collection('collectionName').update(
{
   user:"userToUpdate"
},
{
   user:"userToUpdate",
   someData: "someNewData"
},
{
   upsert:true
});

conn.collection('collectionName').findOne(
{
   user:"userToFind"
},
function(err, doc)
{
   if (err) { /* something is wrong */ }
   if (doc) { var foundData = doc.someData; }
});

