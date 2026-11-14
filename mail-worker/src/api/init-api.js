import app from '../hono/hono';
import { dbInit } from '../init/init';

app.get('/init/:secret', (c) => {
	return dbInit.init(c);
})

/*
 * Deployment-only bootstrap. Remove immediately after the first successful initialization.
 * Does not change the JWT secret or user credentials.
 */
app.get('/init/bootstrap/empty-database', async (c) => {
  if (await c.env.kv.get('setting:')) {
    return c.text('already initialized');
  }
  const bootstrapContext = {
    env: c.env,
    req: { param: () => c.env.jwt_secret },
    set: () => {},
    text: (body) => c.text(body),
  };
  return dbInit.init(bootstrapContext);
});
