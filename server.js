/**
 * Created by vslimit on 2017/9/8.
 */
'use strict';
require('dotenv').config();
const Koa =require('koa');
const app = new Koa();
const fs = require('fs');
const join = require('path').join;
const bodyParser = require('koa-bodyparser');
const model = join(__dirname, 'app/model');
var Router = require('koa-router');
var router = new Router();
const rest = require('./config/rest');

const config = require('./config');

const port = process.env.PORT || 3000;

module.exports = app;
app.use(bodyParser());
// app.use(async ctx => {
//     ctx.body = ctx.request.body;
// });
app.use(rest.restify());
app.use(router.routes()).use(router.allowedMethods());

fs.readdirSync(model)
    .filter(file => ~file.search(/^[^\.].*\.js$/))
    .forEach(file => require(join(model, file)));


// let files = fs.readdirSync(model);


require('./config/routes')(router);

listen();

module.exports = model;

function listen() {
    if (router.get('env') === 'test') return;
    app.listen(port);
    console.log('Express app started on port ' + port);
}

function connect() {
    // var options = {server: {socketOptions: {keepAlive: 1}}}
}