const assert = require('assert');
const environment = String(process.env.NODE_ENV).trim();

const configs = {
	production: function() {
		return {
			publicDir: 'app/public',
			environment: 'production',
			sessionKeys: [ String(Math.random()) ],
		};
	},
	development: function() {
		return {
			publicDir: 'app/public',
			environment: 'development',
			sessionKeys: ['this is not secure'],
		};
	},
};

let config = configs[environment];
assert(config, `koa-server: Configuration ${environment} does not exist, NODE_ENV must be one of ${Object.keys(configs)}`);

config = config();

module.exports = config;

function assertEnvVar(envVar, description) {
	let value = process.env[envVar];

	if (typeof value === 'string') {
		value = value.trim()
	}

	assert(value !== null && value !== undefined, `koa-server: Environment variable ${envVar} (currently is ${value}) must be present. Description: ${description}`);

	return value;
}

function optionalEnvVar(envVar, description, defaultValue) {
	let value = process.env[envVar];

	if (typeof value === 'string') {
		value = value.trim()
	}

	if (value === null || value === undefined) {
		if (defaultValue === undefined) {
			console.warn(`koa-server: Optional environment variable ${envVar} not present. Description: ${description}`);
		} else {
			console.warn(`koa-server: Optional environment variable ${envVar} not present. Description: ${description}. Using default value ${defaultValue}`);
		}
	}

	return value || defaultValue;
}
