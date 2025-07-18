import { Application } from '../deps.ts';
import routerBody from './router-body.ts';
import routerForm from './router-form.ts';
import routerQuery from './router-query.ts';
import routerSanitizer from './router-sanitizer.ts';
import routerHeader from './router-header.ts';
import routerCustomError from './router-custom-error.ts';
import routerAll from './router-all.ts';

const app = new Application();
app.use(routerBody.routes());
app.use(routerForm.routes());
app.use(routerQuery.routes());
app.use(routerSanitizer.routes());
app.use(routerHeader.routes());
app.use(routerCustomError.routes());
app.use(routerAll.routes());

export default app;
