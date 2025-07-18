***

<div align="center">
<b>Validator4Oak</b><br>
Validator & Sanitizer middleware for Oak.
</div>

<div align="center">

[![Master CI](https://github.com/petruki/validator4oak/actions/workflows/master.yml/badge.svg)](https://github.com/petruki/validator4oak/actions/workflows/master.yml)
[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=petruki_validator4oak&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=petruki_validator4oak)
[![deno.land/x/validator4oak](https://shield.deno.dev/x/validator4oak)](https://deno.land/x/validator4oak)
[![JSR](https://jsr.io/badges/@trackerforce/validator4oak)](https://jsr.io/@trackerforce/validator4oak)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

</div>

***

This module provides a middleware for [Oak](https://github.com/oakserver/oak) to validate and sanitize requests.

**Compatibility**: Oak v14.0.0+

- Validate request query, body, form and header parameters
- Sanitize request parameters
- Define custom error handlers
- Create custom validators and sanitizers
- Stack up multiple validators and sanitizers


Import module with:
    
```typescript
import * as mod from "@trackerforce/validator4oak@[VERSION]";
import * as mod from "https://deno.land/x/validator4oak@v[VERSION]/mod.ts";
```

# Usage

### Validate query parameters

```typescript
const router = new Router();
const { query, check } = ValidatorMiddleware.createMiddleware<Context, Next>();
const { isUrl } = ValidatorFn.createValidator();

router.get('/api/v1/shorten',
  query(check('name').ifValue(isUrl())), 
  (ctx: Context) => {
    // ...
  },
);
```

Optional query parameters:

```typescript
router.get('/api/v1/shorten',
  query(check('url').isOptional()), 
  (ctx: Context) => {
    // ...
  },
);
```

### Validate body and form parameters

Key body parameters can be accessed using complex keys, e.g. `order.number`.<br>
Since Oak v14, body request can only be consumed once, so you'll need to use state.request_body to access it within the route.

Using body:

```typescript
router.post('/checkout/v1/confirm',
  body(check('order.number').ifValue(isNumeric())),
  (ctx: Context) => {
    // ...
    const body = ctx.state.request_body; // Access the body request
    // ...
  },
);
```

Using form:

```typescript
router.post('/checkout/v1/confirm',
  form(check('order.number').ifValue(isNumeric())), 
  (ctx: Context) => {
    // ...
    const body = ctx.state.request_body; // Access the form request
    // ...
  },
);
```

It's also possible to validate array of complex objects using `isArray()` and `*` wildcard to access array elements.

```typescript
router.post('/checkout/v1/confirm',
  body(
    check('order.items').ifValue(isArray()),
    check('order.items.*.sku').ifValue(isString(), hasLenght({ min: 6 })),
    check('order.items.*.quantity').ifValue(isNumeric())
  ), (ctx: Context) => {
    // ...
  },
);
```

### Validate header parameters

```typescript
const { header } = ValidatorMiddleware.createMiddleware<Context, Next>();
const { isNumber } = ValidatorFn.createValidator();

router.post('/example/v1/shorten',
  header(check('x-api-key').ifValue(isNumber())), 
  (ctx: Context) => {
    // ...
  },
);
```

### Sanitize parameters

```typescript
const { escape, trim } = ValidatorSn.createSanitizer();
const { hasLenght } = ValidatorFn.createValidator();

router.post('/message/v1/send',
  body(
    check('message')
      .sanitizeWith(escape(), trim())
      .ifValue(hasLenght({ max: 500 }))
  ), (ctx: Context) => {
    // ...
  },
);
```

### Testing

Use `deno task test` to run tests.

#### Check Oak compatibility

Replace the Oak version in the `tests/deps.ts` file to verify if middleware is compatible.
```typescript
export * from "jsr:@oak/oak@[OAK_VERSION]";
```

## Contributing

Please open an issue if you have some cool ideas to contribute.
