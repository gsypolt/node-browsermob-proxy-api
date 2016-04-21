var webdriverjs = require("webdriverjs");
var fs = require('fs');
var MobProxy = require('browsermob-proxy-api');
var proxy = new MobProxy({'host':'localhost', 'port': '8080'});
var proxyHost = 'localhost';
var proxyPort = 8082;

// start listenign on port 8082:
proxy.startPort(proxyPort, function(err, data) {
  // start a new HAR report
  if (!err) {
    var headersToSet = {
      'User-Agent': 'Bananabot/1.0',
      'custom-header1': 'custom-header1-value',
      'custom-header2': 'custom-header2-value'
    }
    console.log('In start proxy branch.');
    proxy.setHeaders(proxyPort, headersToSet, function(err, resp) {
      if(!err) {
        var harSpecs = {
          'initialPageRef': 'usat_home',
          'captureHeaders': true,
          'captureContent': true,
          'captureBinary': true
        }
        console.log('In set headers branch.');
        proxy.createHAR(proxyPort, harSpecs, function(err, resp) {
          if (!err) {
            console.log('In crate HAR branch.');
            doSeleniumStuff(proxyHost + ':' + proxyPort, function() {
              proxy.getHAR(proxyPort, function(err, resp) {
                if(!err) {
                  console.log('In write to HAR branch.');
                  fs.writeFileSync('output.har', resp, 'utf8');
                } else {
                  console.error('Error reading HAR file: ' + err);
                }
                proxy.stopPort(proxyPort, function() {});
              });
            });
          } else {
            console.error('Error creating HAR file: ' + err);
            proxy.stopPort(proxyPort, function() {});
          }
        });
      } else {
        console.error('Error setting the headers: ' + err)
        proxy.stopPort(proxyPort, function() {});
      }
    });
  } else {
    console.error('Error starting proxy: ' + err)
    proxy.stopPort(proxyPort, function() {});
  }
});

function doSeleniumStuff(proxy, cb) {
  var browser = webdriverjs.remote( {
    host: 'localhost',
    port: 4444,
    desiredCapabilities: {
      browserName: 'firefox',
      seleniumProtocol: 'WebDriver',
      proxy: {
        httpProxy: proxy
      }
    }
  });

  browser
    .init()
    .url('http://www.usatoday.com')
    .setValue(".site-masthead-search-form-input", "Rochester")
    .submitForm(".site-masthead-search-btn")
    .saveScreenshot('results.png')
    .end(cb);
}
