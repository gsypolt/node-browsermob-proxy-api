# Node BrowserMob Proxy API

This project provides a NodeJS interface for interacting with a running BrowserMob Proxy through it's REST API. All methods in the REST API are available including JavaScript-based interceptors for requests/responses.

## Usage

First clone the **Browsermob Proxy API** with the following command:
```
$ git clone git@github.com:sbmallik/node-browsermob-proxy-api.git
```

Install the dependent packages:
```
$ npm install
```

Download the _browsermob proxy_ bundle from this [link](https://github.com/lightbody/browsermob-proxy/releases/download/browsermob-proxy-2.1.0-beta-5/browsermob-proxy-2.1.0-beta-5-bin.zip) and extract the contents in a local folder. Start the browsermob proxy as described in this [link](https://github.com/lightbody/browsermob-proxy#rest-api).
Also start the selenium server with the following command in the root directory:
```
$ java -jar node_modules/selenium-server-standalone-jar/jar/selenium-server-standalone-2.53.0.jar
```

Finally run the test with this command:
```
$ node generateHar.js
```


## Documentation

For the specifics of the REST API used by BrowserMob Proxy, please see their [documentation](https://github.com/lightbody/browsermob-proxy/blob/master/README.md).

### Examples
To open a port (10800) and start a new HAR:
```javascript
var MobProxy = require('browsermob-proxy-api');
var proxy = new MobProxy({'host':'localhost', 'port': '8080'});

// start listening on port 10800:
proxy.startPort(10800, function(err, data) {
    // start new HAR report
    proxy.createHAR(10800, { 'initialPageRef': 'foo' });
});
```

To get the current HAR from a previously opened port:
```javascript
proxy.getHAR(10800, function(err, data) {
    console.log(data);
});
```
