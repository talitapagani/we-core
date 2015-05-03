
module.exports = function serverErrorResponse(data) {
  var req = this.req;
  var res = this.res;
  var we = req.getWe();

  res.status(500);
  res.locals.template = '500';

  if (data && we.env != 'prod') we.log.error(data);

  if (!data) data = {};

  if (!res.locals.responseType || res.locals.responseType == 'html') {
    return res.view(data);
  }

  if (res.locals.responseType == 'json') {
    // set messages
    data.messages = res.locals.messages;
    return res.send(data);
  }

  we.log.error('Unknow responseType:', res.locals.responseType);
}