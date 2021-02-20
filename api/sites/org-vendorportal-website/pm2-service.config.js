module.exports = {
  "apps": [
    {
      "name": "vendorportal-website",
      "env": {
        "PORT": 4021
      },
      "script": "website.js",
      "args": "--confdir website",
      "exec_mode": "fork",
      "instances": 1
    },
    {
      "name": "squareup-webhook",
      "env": {
        "PORT": 4022
      },
      "script": "squareup-webhook.js",
      "args": "--confdir squareup-webhook",
      "exec_mode": "fork",
      "instances": 1
    }
  ]
}
