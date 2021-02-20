const PROXY_CONFIG = {
    "/api/*": {
      "target": "http://127.0.0.1:3020",
      "secure": false,
      "logLevel": "debug",
      "onError": (err, req, res) => {
        res.status(503).json({'error': 'Cannot Reach API Service'});
      }
    }
  };
  
  module.exports = PROXY_CONFIG;