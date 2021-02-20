module.exports = {
  "apps": [
    {
      "name": "skydiveorbust-website-api",
      "env": {
        "PORT": 4021
      },
      "script": "website.js",
      "args": "--confdir website",
      "exec_mode": "fork",
      "instances": 1
    }
  ]
}
