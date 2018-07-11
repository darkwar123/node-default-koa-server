const debug = require('debug')('koa-server:debug');
const info = require('debug')('koa-server:info');
const error = require('debug')('koa-server:error');

module.exports = { debug, info, error };