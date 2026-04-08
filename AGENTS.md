# Copilot Instructions For NNPTUD-C5

## Goal
Generate code that is consistent with this project:
- Node.js + Express + Mongoose
- CommonJS module style (require/module.exports)
- REST API under /api/v1
- Prefer small, safe, minimal diffs

## Coding Style

- Use CommonJS only:
  - Import: const/let x = require(...)
  - Export: module.exports = ...
- Use const by default, only use let when reassignment is needed.
- Use semicolons.
- Use single quotes.
- Prefer 2-space indentation.
- Keep functions short and readable.
- Add comments only when logic is non-obvious.

## Route, Controller, Service Boundaries

- routes/:
  - Define endpoint path, middleware chain, and call controller.
  - Do not put heavy business logic or multi-step DB logic directly in route handlers.
- controllers/:
  - Handle request parsing, call service/controller helpers, return HTTP response.
  - No duplicated validation logic.
- services/ (create when adding medium/complex features):
  - Place business rules, transaction logic, and cross-model operations here.
- schemas/:
  - Only Mongoose schema/model definitions, hooks, and schema-level constraints.
- utils/:
  - Reusable helper functions and middlewares only.
  - Keep utilities stateless when possible.

## API Conventions

- Base prefix is /api/v1.
- Resource endpoints:
  - GET /resource
  - GET /resource/:id
  - POST /resource
  - PUT or PATCH /resource/:id
  - DELETE /resource/:id (soft delete when model supports isDeleted)
- Always validate input for create/update endpoints.
- Use early return after sending error responses.
- Every async handler should have error handling (try/catch and proper response or next(error)).

## Response Conventions

- Prefer consistent JSON response shape:
  - Success:
    - { "success": true, "data": ..., "message": "optional" }
  - Error:
    - { "success": false, "message": "...", "errors": "optional detail" }
- Use proper status codes:
  - 200 OK
  - 201 Created
  - 400 Bad Request
  - 401 Unauthorized
  - 403 Forbidden
  - 404 Not Found
  - 409 Conflict
  - 500 Internal Server Error
- Do not return raw internal error objects to clients.

## Database Conventions (Mongoose)

- Keep model names singular, file names plural (follow existing project pattern).
- Respect soft-delete pattern where isDeleted exists.
- For multi-document write operations, use mongoose session + transaction.
- Validate ObjectId inputs before querying when needed.
- Use populate selectively with explicit fields (select) to avoid overfetching.

## Auth And Security

- Use checkLogin for protected routes.
- Use checkRole after checkLogin when role restriction is required.
- Never hardcode secrets, tokens, role IDs, or DB credentials in new code.
- Read secrets from environment/config.
- Never expose password hashes or sensitive fields in API responses.

## File Organization Rules For New Features

When adding a new domain (example: orders), prefer this structure:
- routes/orders.js
- controllers/orders.js
- services/orders.js
- schemas/orders.js
- Optional validators in utils/validator.js or a dedicated validators module

Also update app.js to register the new route under /api/v1/orders.

## Change Discipline For Copilot

- Do not refactor unrelated files.
- Preserve existing API behavior unless task explicitly asks for breaking changes.
- Keep naming consistent with current domain terms.
- If a pattern already exists in the same module, follow that pattern first.
- If introducing a new convention, apply it only to touched/new code (no broad rewrite).