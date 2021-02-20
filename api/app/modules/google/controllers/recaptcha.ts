/*
import { post as requestPost } from 'request';
export function middle(req, res, next) {
  const body = req.body || {};

  const captchaRequest = {
    secret: '***',
    response: body.recaptcha,
    remoteip: req.ip
  };

  const requestOpts = {
    url: 'https://www.google.com/recaptcha/api/siteverify',
    formData: captchaRequest
  };

  requestPost(requestOpts, (err, resp, resp_body) => {
    if (err) {
      res.status(401).send('Bad Captcha');
    } else {
      const resp_json = JSON.parse(resp_body);
      const success = resp_json.success || false;
      if (!success) {
        res.status(401).send('Bad Captcha');
      } else {
        next();
      }
    }
  });
}
*/
