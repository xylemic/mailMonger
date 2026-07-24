# sprint 5 notes
**date:** july 24, 2026

---

# sprint goal

today's objective was to complete the api key issuance flow and begin turning api keys into something mailmonger could actually authenticate

by the end of the sprint, the goal was for mailmonger to:

- issue real api keys
- securely store only hashed secrets
- return the complete api key exactly once
- retrieve an api key efficiently using its identifier
- authenticate an incoming api key using bcrypt

this sprint would effectively complete the first version of mailmonger's authentication engine

---

# what we built

## completed api key issuance

implemented the service responsible for issuing api keys.

the flow now performs the following steps:

1. generate a unique identifier
2. generate a cryptographically secure secret
3. build the complete mailmonger api key
4. hash only the secret
5. store the identifier and hash in postgresql
6. return the complete api key once

this mirrors how production platforms like stripe, github and resend issue api credentials

---

## completed repository support

implemented:

- `createApiKeyRecord()`
- `findApiKeyByIdentifier()`

the repository layer remains intentionally simple

its responsibility is only to retrieve or persist data

it does not know anything about authentication, bcrypt or business rules

---

## completed api key endpoint

added an endpoint capable of issuing real mailmonger api keys

request:

```json
{
  "customerId": "...",
  "name": "development"
}
```

response:

```json
{
  "message": "api key created successfully. store it securely because it will not be shown again",
  "apiKey": "mm_live_mk_xxxxxxxxxx.xxxxxxxxxxxxxxxxx"
}
```

only the customer ever sees the complete key

the database never stores the secret

---

## verified secure storage

confirmed that postgresql stores only:

- identifier
- bcrypt hash

example:

```text
identifier:
mk_37c57bbbe7

key_hash:
$2b$12$...
```

the original secret never exists in storage.

---

## completed api key lookup

implemented:

```text
findApiKeyByIdentifier()
```

instead of searching every stored api key, mailmonger now performs a direct lookup using the identifier

flow:

```
api key
    ↓
parse
    ↓
identifier
    ↓
single indexed database lookup
    ↓
matching row
```

this was the architectural reason we introduced identifiers instead of hashing the entire api key

---

## implemented api key verification

created:

```
verifyApiKey()
```

using:

```ts
bcrypt.compare()
```

important realization:

bcrypt never decrypts

instead, it hashes the incoming secret using the stored salt and verifies whether both hashes match

---

## implemented authentication service

created:

```
authenticateApiKey()
```

this service orchestrates the entire authentication process

flow:

```
incoming api key
        ↓
parse
        ↓
extract identifier + secret
        ↓
lookup identifier
        ↓
retrieve stored hash
        ↓
bcrypt.compare()
        ↓
authenticated api key record
```

this service became the first true authentication engine inside mailmonger

---

# debugging journey

## unsettled top-level await

while testing:

```bash
pnpm tsx src/features/api-keys/test.ts
```

node produced:

```
warning: detected unsettled top-level await
```

initial suspicion was that drizzle or postgresql was malfunctioning

after inspecting the connection lifecycle, the real cause became clear

the standalone script never established its own database connection

our server normally performs:

```
connect database
↓
start express
```

but the standalone script skipped that step entirely.

solution:

```ts
await connectDatabase()
...
await disconnectDatabase()
```

lesson learned:

server processes and standalone scripts have different lifecycles

they cannot assume the database has already been connected

---

## null authentication result

after fixing the connection lifecycle, authentication returned:

```
null
```

instead of assuming the repository was broken, we investigated the data

the real cause was simple

earlier in development the api_keys table had been truncated after improving the endpoint response

the identifier being searched no longer existed

after using the newly issued identifier:

```
mk_37c57bbbe7
```

authentication worked immediately

lesson learned:

always verify whether the data being queried actually exists before assuming application logic is incorrect

---

# architectural discussions

## separating authentication from express

instead of placing authentication logic directly inside middleware, we built it independently first.

middleware will eventually become nothing more than:

```ts
const authenticated = await authenticateApiKey(apiKey)
```

this keeps authentication reusable and independently testable

---

## composing small functions

today reinforced why we have consistently broken responsibilities into small units

authentication is now composed of:

```
parseApiKey()

↓

findApiKeyByIdentifier()

↓

verifyApiKey()

↓

authenticateApiKey()
```

each function has exactly one responsibility.

the larger authentication flow simply orchestrates them together

---

# important reasoning captured today

## authentication should answer one question only

during implementation we discussed the responsibility of authentication

authentication should only answer:

> "does this api key belong to a valid stored key?"

it should not decide:

- whether the customer may send email
- whether billing is active
- whether quotas have been exceeded

those belong to authorization and business policy layers

keeping those concerns separate keeps the architecture clean

---

# milestone reached

today marked an important transition

before today:

mailmonger could issue api keys

after today:

mailmonger can recognize them

authentication is no longer theoretical

it is now implemented end-to-end

---

# testing performed

successfully verified:

- api key generation
- identifier generation
- secure bcrypt hashing
- api key storage
- repository lookup
- parsing
- bcrypt verification
- successful authentication
- authentication failure after modifying a single character in the secret

the final test was particularly important

changing only one character correctly caused authentication to fail, confirming that verification behaves exactly as expected

---

# personal reflections

today reinforced an important engineering lesson

not every bug is caused by code

sometimes the application is correct and the data is wrong

the authentication lookup returning `null` initially felt like a repository problem, but the real issue was simply that the identifier being searched no longer existed after truncating the table

another important realization was seeing how much easier the authentication flow became because of earlier architectural decisions

the decision to split an api key into:

- identifier
- secret

allowed us to authenticate efficiently without sacrificing security

instead of searching every stored hash, mailmonger performs one indexed lookup before using bcrypt for verification

that design choice from sprint 4 paid off today

---

# sprint summary

today mailmonger crossed a major architectural milestone

it no longer only creates credentials

it now understands them

for the first time, mailmonger possesses a complete authentication engine capable of verifying whether an incoming api key truly belongs to one of its customers

---

# goals for sprint 6

tomorrow's sprint will integrate authentication into the http layer

planned work:

- create authentication middleware
- read the authorization header
- validate bearer token format
- authenticate incoming api keys automatically
- return 401 for missing or invalid credentials
- attach the authenticated api key (and later the customer) to the request
- protect a real endpoint using the middleware
- perform end-to-end testing with:
  - missing api key
  - malformed api key
  - modified api key
  - valid api key

this will be the moment mailmonger begins enforcing authentication across its api rather than simply issuing credentials



