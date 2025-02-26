import { Application } from '../deps.ts';
import routerBody from './router-body.ts';
import routerQuery from './router-query.ts';
import routerSanitizer from './router-sanitizer.ts';
import routerHeader from './router-header.ts';
import routerCustomError from './router-custom-error.ts';

const app = new Application();
app.use(routerBody.routes());
app.use(routerQuery.routes());
app.use(routerSanitizer.routes());
app.use(routerHeader.routes());
app.use(routerCustomError.routes());

export default app;
