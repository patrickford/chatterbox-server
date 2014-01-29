/* You should implement your request handler function in this file.
 * And hey! This is already getting passed to http.createServer()
 * in basic-server.js. But it won't work as is.
 * You'll have to figure out a way to export this function from
 * this file and include it in basic-server.js so that it actually works.
 * *Hint* Check out the node module documentation at http://nodejs.org/api/modules.html. */
// var responseData = [
//   {text: 'hello', username: 'peter'}
// ];
var url = require('url');
var fs = require('fs');

var headers = {
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "GET, POST, PUT, DELETE, OPTIONS",
  "access-control-allow-headers": "content-type, accept",
  "access-control-max-age": 10, // Seconds.
  "Content-Type": "application/json"
};

var handleRequest = function(request, response) {

  var urlObj = url.parse(request.url, null, true);

  console.log("Serving request type " + request.method + " for url " + request.url);
  console.log(urlObj.pathname);

  var statusCode = 404;

  if(request.method === 'OPTIONS') {
    statusCode = 200;
    response.writeHead(statusCode, headers);
    response.end();
  }

  if(request.method === 'GET') {
    if (urlObj.path === '/classes/room1' || urlObj.path === '/classes/messages') {
      request.on('end', function(){
        var contents = JSON.parse('[' + fs.readFileSync('messages.txt','utf8') + ']');
        var reversed = contents.reverse();
        statusCode = 200;
        response.writeHead(statusCode, headers);
        // response.end(JSON.stringify({results: responseData}));
        response.end(JSON.stringify({results: reversed}));
      });
    } else
    {
      statusCode = 404;
      response.writeHead(statusCode, headers);
      response.end();
    }
  }

  if(request.method === 'POST'){
    var requestString = '';
    request.on('data', function(data){
      requestString += data;
    });

    request.on('end', function(){
      //responseData.unshift(JSON.parse(requestString));
      fs.open('messages.txt', 'a', 666, function( e, id ) {
        console.log(fs.readFileSync('messages.txt','utf8'));
        fs.write( id, ',' + requestString, null, 'utf8', function(){
          fs.close(id, function(){
            console.log('file closed');
          });
        });
      });

      statusCode = 201;
      response.writeHead(statusCode, headers);
      response.end('{}');
    });
  }
};

module.exports.handleRequest = handleRequest;