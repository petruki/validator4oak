export { Application, Context, Router } from 'jsr:@oak/oak@17.1.3';
export type { Next } from 'jsr:@oak/oak@17.1.3';
export { assertEquals, assertNotEquals, assertThrows } from 'jsr:@std/assert@1.0.9';
export { type IResponse, superoak } from 'https://deno.land/x/superoak@4.8.1/mod.ts';

// Fixes superdeno@4.9.0 issue
// deno-lint-ignore no-explicit-any
(globalThis as any).window = globalThis;