# Default Koa.js server for Node.js

**You absolutely need Node.js v6.0.0 or later or this won't work.**

Install it from [npm](https://www.npmjs.com/package/default-koa-server)

## Installing

Using npm:

```bash
$ npm install default-koa-server
```

# Example

```javascript
const Koa = require('default-koa-server');
const router = require('koa-router')();

const app = Koa({ router });
app.listen(3000);
```

# Support

Report bugs on the [issue tracker](https://github.com/darkwar123/node-default-koa-server/issues)
