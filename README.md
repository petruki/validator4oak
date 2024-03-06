***

<div align="center">
<b>Validator4Oak</b><br>
Validator & Sanitizer middleware for Oak.
</div>

<div align="center">

[![Master CI](https://github.com/petruki/validator4oak/actions/workflows/master.yml/badge.svg)](https://github.com/petruki/validator4oak/actions/workflows/master.yml)
[![deno.land/x/skimming](https://shield.deno.dev/x/validator4oak)](https://deno.land/x/validator4oak)
[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=petruki_validator4oak&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=petruki_validator4oak)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

</div>

***

# `validator4oak` - Deno Module for Oak

This module provides a middleware for Oak to validate request using JSON Schema.

Main features:
- Validate request query, body, header parameters
- Sanitize request query, body, header parameters
- Allow to define custom error handler
- Allow to create custom validators and sanitizers
- Stack multiple validators and sanitizers for the same parameter

Import module with:
    
```typescript
import { ValidatorMiddleware, ValidatorFn, ValidatorSn } from "https://deno.land/x/validator4oak@v[VERSION]/mod.ts";
```

# Usage

### Validate query parameters

```typescript
const router = new Router();
const { query } = ValidatorMiddleware.createMiddleware();
const { isUrl } = ValidatorFn.createValidator();

router.get('/api/v1/shorten',
  query([
    { key: 'url', validators: [isUrl()] },
  ]), (ctx: Context) => {
    // ...
  },
);
```

Optional query parameters:

```typescript
router.get('/api/v1/shorten',
  query([
    { key: 'url', optional: true },
  ]), (ctx: Context) => {
    // ...
  },
);
```

### Validate body parameters

Key body parameters can be accessed using complex keys, e.g. `order.number`.

```typescript
router.post('/checkout/v1/confirm',
  body([
    { key: 'order.number', validators: [isNumeric()] },
  ]), (ctx: Context) => {
    // ...
  },
);
```

### Santize parameters

```typescript
const { escape } = ValidatorSn.createSanitizer();

router.post('/message/v1/send',
  body([
    { key: 'message', validators: [hasLenght({ max: 500 })], sanitizers: [escape()] },
  ]), (ctx: Context) => {
    // ...
  },
);
```

### Testing

Use `deno task test` to run tests.

## Contributing

Please do open an issue if you have some cool ideas to contribute.
