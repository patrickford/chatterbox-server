/* You should implement your request handler function in this file.
 * And hey! This is already getting passed to http.createServer()
 * in basic-server.js. But it won't work as is.
 * You'll have to figure out a way to export this function from
 * this file and include it in basic-server.js so that it actually works.
 * *Hint* Check out the node module documentation at http://nodejs.org/api/modules.html. */
var responseData = [];
var url = require('url');


exports.handleRequest = function(request, response) {
  //var requestURL = url.parse(request.url, [true],[true]);
  /* the 'request' argument comes from nodes http module. It includes info about the
  request - such as what URL the browser is requesting. */

  /* Documentation for both request and response can be found at
   * http://nodemanual.org/0.8.14/nodejs_ref_guide/http.html */
  var urlObj = url.parse(request.url, null, true);

  console.log("Serving request type " + request.method + " for url " + request.url);
  console.log(urlObj.pathname);

  // var responseData = [];
  var statusCode;

  /* Without this line, this server wouldn't work. See the note
   * below about CORS. */
  var headers = defaultCorsHeaders;
  headers['Content-Type'] = "text/plain";

  if(request.method === 'OPTIONS') {
    //debugger;
    statusCode = 200;
    response.writeHead(statusCode, headers);
    response.end();
  }

  if(request.method === 'GET') {
    if (urlObj.path === '/classes/room1') {
      request.on('end', function(){
        statusCode = 200;
        response.writeHead(statusCode, headers);
        response.end(JSON.stringify(responseData));
      });
    } else
    {
      statusCode = 404;
      response.writeHead(statusCode, headers);
      response.end();
    }
  }

  if(request.method === 'POST'){
    // Add validation of properly formatted messageObj
    request.on('end', function(){
      console.log(request._postData);
      responseData.push(request._postData);

      statusCode = 201;
      response.writeHead(statusCode, headers);
      response.end();
    });
  }


  /* .writeHead() tells our server what HTTP status code to send back */
  // response.writeHead(statusCode, headers);

  /* Make sure to always call response.end() - Node will not send
   * anything back to the client until you do. The string you pass to
   * response.end() will be the body of the response - i.e. what shows
   * up in the browser.*/
  // response.end(JSON.stringify(responseData));
};

/* These headers will allow Cross-Origin Resource Sharing (CORS).
 * This CRUCIAL code allows this server to talk to websites that
 * are on different domains. (Your chat client is running from a url
 * like file://your/chat/client/index.html, which is considered a
 * different domain.) */
var defaultCorsHeaders = {
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "GET, POST, PUT, DELETE, OPTIONS",
  "access-control-allow-headers": "content-type, accept, X-Parse-Application-Id, X-Parse-REST-API-Key",
  "access-control-max-age": 10 // Seconds.
};
