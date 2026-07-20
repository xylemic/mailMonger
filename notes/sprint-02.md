# sprint 2

## objective

continue strengthening the email request feature by introducing validation, clear layer responsibilities, and the first background processor

---

## what we built

### request validation

the api now validates incoming requests before they enter the application

invalid requests are rejected immediately

valid requests continue into the service layer

this protects the rest of the application from malformed input

---

### dto

the external http request is no longer the same thing as the application's internal model

the controller receives a dto

the service translates the dto into a domain object

this separation means external api changes are less likely to ripple through the application

---

### service responsibilities

the service now owns business decisions

examples:

- translating dto -> domain model
- assigning initial status (`queued`)

repositories should not make these decisions

---

### repository responsibilities

the repository now only talks to the database

it knows:

- how to insert
- how to query
- how to update

it does not know business rules

---

### first background processor

mailmonger now has a processor that runs independently of incoming requests

every few seconds it:

- looks for one queued email request
- processes it
- marks it as sent

the api produces work

the processor consumes work

---

### startup lifecycle

the processor no longer starts independently

the application now starts in a deliberate order

1. connect to the database
2. start the http server
3. start the email processor

startup order is part of architecture

---

## important concepts introduced

- zod validation
- dto (data transfer object)
- separation of concerns
- repository pattern
- background workers
- polling
- producer-consumer architecture
- application startup lifecycle
- state transitions
- update queries with drizzle

---

## biggest lessons

validation belongs at the boundary

services own business logic

repositories own persistence

processors perform background work

the server starts components but should not manage their internal behavior.

git remembers history better than comments

---

## questions worth thinking about

why should the client send only the minimum amount of information possible?

why should repositories avoid business logic?

what makes polling simple, and what makes it inefficient?

how would the processor behave if there were ten thousand queued emails?

what would happen if the processor crashed halfway through processing an email?

how would multiple processors avoid processing the same email twice?

---

## reinforcement

### zod

- build three schemas from scratch.
- practice parsing both valid and invalid payloads.
- understand `safeParse()` thoroughly

---

### drizzle

practice writing:

- insert
- select
- update
- where
- limit

without looking at previous code.

---

### repositories

ask yourself for every new function:

"is this business logic or persistence?"

if the answer is persistence, it probably belongs in the repository

---

### services

practice translating one object into another

this pattern appears everywhere in backend systems

---

### processors

draw the lifecycle on paper

queued

↓

sent

then extend it mentally

queued

↓

processing

↓

sent

then imagine failures.

queued

↓

processing

↓

failed

↓

retry

the status field is really a state machine.

---

## things to revisit later

- event-driven processing
- batching
- retry strategies
- dead-letter queues
- provider rate limits
- worker concurrency
- distributed workers
- graceful shutdown
- startup readiness
- application lifecycle

---

## philosophy reinforced today

first make it work

then make it understandable

then make it resilient

small improvements, consistently applied, become architecture


