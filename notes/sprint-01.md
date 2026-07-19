# sprint 01

## objective

accept an email request and persist it.

---

## outcome

successfully completed.

the api now accepts an email request, persists it to postgresql, and returns a `202 accepted` response.

the request was verified directly in postgresql using `psql`, confirming that mailmonger fulfilled its first business promise.

---

## engineering concepts introduced

### 1. typescript is more than type safety

#### what happened

i tried calling `db.insert(...)` on a postgresql `client`.

typescript immediately pointed out that `client` doesn't have an `insert` method.

the mistake wasn't syntax. it was an architectural misunderstanding.

#### key lesson

types describe the capabilities of an object.

typescript helps uncover incorrect assumptions before the application runs.

#### reinforce

- read about structural typing in typescript.
- learn how libraries expose apis through types.
- practice hovering over variables in vs code to inspect inferred types.
- compare `pg.client` with drizzle's database object until the difference feels natural.

---

### 2. configuration is not execution

#### what happened

we created a database client separately from connecting to the database.

#### key lesson

creating an object and using it are different responsibilities.

separating them produces cleaner startup code and makes testing easier.

#### reinforce

- read about dependency injection as a concept. no need to implement it yet.
- compare object construction with object lifecycle.
- whenever creating a new component, ask whether configuring it and executing it should be separate responsibilities.

---

### 3. fail before accepting responsibility

#### what happened

the api now connects to postgresql before it begins listening for incoming http requests.

#### key lesson

an application should not advertise itself as healthy until its critical dependencies are available.

if the database is unavailable, the api should fail immediately instead of accepting requests it cannot fulfil.

#### reinforce

- read about fail fast principles.
- research application startup versus readiness.
- learn the difference between startup checks and health checks.

---

### 4. database migrations are version control for schema

#### what happened

we described our schema using drizzle, generated a migration, and applied it to postgresql.

#### key lesson

the database evolves through versioned migrations instead of manual edits.

schema changes become part of the project's history just like source code.

#### reinforce

- learn how drizzle generates migrations.
- compare schema-first and database-first workflows.
- read about why migrations become essential once multiple developers share the same project.

---

### 5. repositories should be boring

#### what happened

the repository only persisted data.

business decisions stayed inside the service layer.

#### key lesson

repositories answer "how do i store this?"

services answer "what should happen?"

keeping those responsibilities separate makes the application easier to understand and maintain.

#### reinforce

- study the repository pattern using small backend examples.
- watch for business logic accidentally creeping into repositories.
- whenever writing repository code, ask whether it contains business decisions that belong elsewhere.

---

### 6. feature-first architecture

#### what happened

instead of grouping files by technical role, we grouped them by business capability.

```text
features/
    email-requests/
```

instead of

```text
controllers/
services/
repositories/
```

#### key lesson

projects grow through business capabilities, not technical folders.

keeping related code together improves navigation and scalability.

#### reinforce

- compare feature-first architecture with layer-first architecture.
- read about vertical slice architecture.
- observe how new features naturally fit into this structure as mailmonger grows.

---

### 7. drizzle complements postgresql

#### what happened

we continued thinking in terms of sql while allowing drizzle to generate migrations and provide a type-safe interface.

#### key lesson

good abstractions reduce repetitive work without hiding the underlying technology.

drizzle works with postgresql instead of replacing it.

#### reinforce

- read drizzle's schema documentation.
- compare generated sql with handwritten sql.
- gradually learn drizzle's query api while continuing to understand the sql underneath.

---

### 8. verify instead of assuming

#### what happened

instead of trusting the migration output, we entered postgresql and inspected the schema ourselves.

we also queried the table after inserting data to confirm the request had actually been persisted.

#### key lesson

good engineers verify the state of the system instead of assuming tools behaved correctly.

#### reinforce

make it a habit that whenever something changes:

- inspect the database.
- inspect the logs.
- inspect the http response.
- verify the system rather than trusting that a command succeeded.

---

## biggest takeaway

today was the first day mailmonger became a real backend application.

we moved from designing architecture to implementing it while preserving the architectural decisions made in the foundry.

the project now accepts an email request, persists it to postgresql, and proves that persistence by directly inspecting the database.

---

## questions to revisit

- how does drizzle wrap the postgresql client?
- how does typescript model third-party libraries?
- why does feature-first architecture scale well?
- what actually happens internally when `pnpm db:migrate` runs?
- how does postgresql execute migrations safely?

---

## tomorrow

### startup resilience

improve application startup by handling startup failures gracefully.

current behaviour:

```text
connect to postgresql

↓

if connection fails

↓

application crashes
```

desired behaviour:

```text
attempt connection

↓

if connection fails

↓

log a clear error

↓

explain why startup failed

↓

exit intentionally
```

this continues the engineering philosophy we've been following throughout the project:

> first make it work.
>
> then make it understandable.
>
> then make it resilient.

