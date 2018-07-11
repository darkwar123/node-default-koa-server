const assert = require('assert');
const environment = process.env.NODE_ENV.trim();

const configs = {
	production: function() {
		return {
			environment: 'production',
			publicDir: assertEnvVar('PUBLIC_DIR', 'The full path to public dir'),
			sessionKeys: [
				assertEnvVar('SESSION_KEY', 'Key used for session managment')
			],
		};
	},
	development: function() {
		return {
			environment: 'development',
			sessionKeys: ['this is not secure'],
			publicDir: assertEnvVar('PUBLIC_DIR', 'The full path to public dir'),
		};
	},
};

let config = configs[environment];
assert(config, `Configuration ${environment} does not exist, NODE_ENV must be one of ${Object.keys(configs)}`);

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
