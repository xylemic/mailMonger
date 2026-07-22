# sprint 3 notes

## objective

today's goal was to transform the email processor from a straight-line worker into a resilient background system capable of handling transient failures

instead of assuming every email would always send successfully, we introduced the idea that failure is part of normal system behavior

---

## what we built

- added a processing state to represent claimed work
- introduced retry_count to track delivery attempts
- implemented retry logic with a maximum retry limit
- distinguished between transient failures and permanent failures
- created a fake email provider that simulates network latency and random failures
- updated the processor to gracefully recover from provider errors
- introduced centralized email status constants to eliminate magic strings
- verified the complete lifecycle through controlled failure testing

---

## important concepts

### state machines

today the processor stopped being a straight sequence of instructions and became a state machine

instead of every request following:

queued

↓

sent

there are now multiple valid journeys:

queued

↓

processing

↓

sent

or

queued

↓

processing

↓

queued

↓

processing

↓

sent

or

queued

↓

processing

↓

queued

↓

processing

↓

queued

↓

processing

↓

failed

thinking in states instead of functions makes backend systems much easier to reason about

---

### transient failure vs permanent failure

not every failure should immediately become a permanent failure

providers experience temporary problems

timeouts happen

networks fail

temporary provider issues should not immediately punish customers

retrying is a business decision

---

### retries are product decisions

the retry limit is not a technical requirement

it is a product decision

different businesses may choose different retry strategies depending on customer expectations

future examples:

- premium customers may receive more retries
- password reset emails may retry more aggressively than newsletters
- different providers may require different retry policies

---

### provider abstraction

the processor no longer knows how email is sent

it only knows that it can ask a provider to send an email

today the provider is fake

tomorrow it could become resend, ses, smtp, mailgun, or another service without changing the processor

this is dependency abstraction

---

### databases should own their own data

instead of reading retry_count into javascript, incrementing it, and writing it back, we allowed postgresql to perform the increment itself

using:

update ... set retry_count = retry_count + 1

prevents lost updates and allows the database to remain the source of truth

---

### observability

logs are not just debugging messages

they tell the story of the system

good logs explain:

- what happened
- which resource was affected
- what decision the system made

after today's work i could follow the complete journey of every email simply by reading the logs

---

### fake failures are valuable

we intentionally increased the provider failure rate to observe the retry behavior

this taught an important lesson:

sometimes we deliberately make systems fail so we can verify that recovery works correctly

engineering confidence often comes from controlled failure rather than perfect success

---

### refactoring insight

today reinforced that not every possible refactoring should be performed

during implementation we considered moving retry logic into the existing service

after reviewing the architecture we decided against it because the service currently represents accepting email requests, while retry handling belongs to delivery processing

good architecture is knowing when not to abstract

---

## things to study deeply

### 1. state machines

study:

- finite state machines
- workflow modeling
- state transitions

exercise:

draw the complete lifecycle of an email request without looking at the code

---

### 2. transient vs permanent failures

study:

- distributed systems failures
- retry strategies
- idempotency

exercise:

research why payment systems retry failed operations

---

### 3. provider abstraction

study:

- dependency inversion principle
- ports and adapters architecture
- hexagonal architecture

exercise:

replace the fake provider mentally with resend and identify which files would actually change

---

### 4. sql expressions inside orm updates

study:

- drizzle sql template
- update statements
- atomic updates

exercise:

understand why letting postgres perform retry_count + 1 is safer than reading and writing the value from javascript

---

### 5. observability

study:

- structured logging
- application logs vs audit logs
- correlation ids

exercise:

look at today's logs and explain the complete story of one failed email request without opening the code

---

### 6. probability in system behavior

today reminded me that expected behavior depends on probability

a provider with a 70% success rate rarely reaches three consecutive failures

changing the success rate to 10% allowed me to intentionally exercise the permanent failure path

this is a useful reminder that testing sometimes requires controlling randomness

---

## engineering lessons

today mailmonger stopped feeling like a crud application

it became a small distributed system

there is now asynchronous work, retries, provider abstraction, background processing, persistence, state transitions, and resilience

the project is still small, but the ideas now resemble those used in production systems.

the scale is different

the thinking is the same


