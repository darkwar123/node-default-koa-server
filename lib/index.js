const assert = require('assert');
const log = require('./components/log');
const config = require('./components/config');

const Koa = require('koa');

const send = require('koa-send');
const flatten = require('flatten');
const serve = require('koa-static');
const helmet = require('koa-helmet');
const koaRouter = require('koa-router');
const session = require('koa-session');
const koaLogger = require('koa-bunyan');
const bodyParser = require('koa-bodyparser');

/**
 * Создает новый экземпляр Koa и возвращает его
 * @apram {Router} router - пути для апи сервера.
 * @apram {Array} [middlewares] - дополнительные обработчики для app.use. (default: [])
 * @return {Koa}
 * */
module.exports = function({ router = koaRouter(), middlewares = [] } = {}) {
	assert(router instanceof koaRouter, `Router variable must be instance of koa-router`);

	const app = new Koa();

	app.keys = config.sessionKeys;
	app.use(session({}, app));

	app.use(helmet());
	app.use(bodyParser({
		formLimit: '20mb',
		jsonLimit: '20mb',
		textLimit: '20mb',
	}));
	app.use(serve(config.publicDir));
	app.use(koaLogger(log, { level: 'info' }));
	require('koa-qs')(app);

	for (let middleware of flatten(middlewares)) {
		app.use(middleware);
	}

	app.use(async (ctx, next) => {
		try {
			await next();
		} catch (error) {
			log.error('Error handling request %O', error);

			ctx.body = {
				time: Math.ceil(Date.now() / 1000),
				status: error.status ? error.status : 500,
				message: error.status ? error.message : 'Internal Error',
			};

			ctx.status = error.status ? error.status : 500;
		}
	});

	app.use(router.routes());

	app.use(async (ctx) => {
		await send(ctx, '/index.html', { root: config.publicDir });
	});

	log.info(`Running in ${config.environment} mode.`);
	log.info(`Config is %O`, config);

	return app;
};