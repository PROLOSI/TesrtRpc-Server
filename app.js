var TestRPC = require("ethereumjs-testrpc");
var server = TestRPC.server();
var $ = require('jquery');
let Web3 = require('web3');
let web3 = new Web3();
web3.setProvider(TestRPC.provider());
const PORT = process.env.PORT || 8081;
let accounts;
server.listen(PORT, function(err, blockchain) {
    console.log('Listening on ', PORT);
    accounts = blockchain.accounts;
});

 
var backdoor = require('http').createServer((request, res) => {

      var headers = request.headers;
      var method = request.method;
      var url = request.url;
      var body = [];

      request.on('error', function(err) {
        console.error(err);
      }).on('data', function(chunk) {
        body.push(chunk);
      }).on('end', function() {
        body = Buffer.concat(body).toString();
        switch (method) {
          case 'POST':
            var payload;
            payload = JSON.parse(body);
            if (payload.time) {
                setTime(payload.time* 1000);
            }
            return;
          default:
            return;
        }
      });      
      res.writeHead(200, { 'Content-Type': 'text/plain' });
      res.end(JSON.stringify(accounts));
    })
    
    backdoor.listen(PORT+1, (err)=>{
        if (err) console.err(err)
    })

    