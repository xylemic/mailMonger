# sprint 4 – customer identity & api key foundations

**date:** 23 july 2026

---

# sprint goal

begin building mailmonger's customer identity layer by introducing customers, api keys, and the architectural foundation for authenticating future api requests

---

# what we built

## 1. customer model

created the `customers` table

fields:

- `id`
- `email`
- `createdAt`
- `updatedAt`

this marks the point where mailmonger begins distinguishing platform customers from email requests

---

## 2. api key model

created the `api_keys` table

included:

- customer relationship
- friendly name
- hashed api key
- identifier
- active status
- created timestamp
- last used timestamp
- optional expiration timestamp

### product discussion

rather than storing only a secret, we discussed what customers actually need once they own multiple api keys

we concluded that good api key management requires metadata

### final decision

every api key should eventually include:

- friendly name
- active / inactive state
- created date
- last used date
- optional expiration date

these fields make key management practical instead of forcing customers to remember random strings

---

## 3. api key architecture

designed the internal structure of mailmonger's api keys

customer sees a single string:

```text
mm_live_<identifier>.<secret>
```

internally that string consists of two completely different concepts

### identifier

purpose:

- locate the database row quickly

properties:

- public
- stored in plaintext
- searchable
- not sensitive

example:

```text
mk_1bc70960d5
```

---

### secret

purpose:

- prove ownership

properties:

- private
- hashed before storage
- never stored in plaintext

example:

```text
vwz8p2lucwws--dw_nogm4dph1rks1mfhrzs1o_hqu
```

> **note:** this example has been lowercased to match the style of these notes. actual generated secrets are case-sensitive and should never be modified in real usage

---

## 4. generation utilities

implemented:

- `generateApiKeyIdentifier()`
- `generateApiKeySecret()`
- `buildApiKey()`
- `hashApiKey()`

`hashApiKey()` is intentionally not yet used

it will become part of the api key issuance flow during sprint 5

---

# architectural discussions

## why not search by hash?

### initial intuition

hash the incoming api key and search the database

### problem

modern password hashing algorithms (bcrypt, argon2) intentionally generate different hashes for the same input

that makes direct database lookup impossible

### final design

instead:

1. extract identifier
2. find the row using the identifier
3. verify the secret against the stored hash

this gives:

- fast lookup
- strong hashing
- no compromise between security and performance

---

## customer experience

one important product observation:

> "the customer should only ever see one clean string"

internally the key is split into two pieces

customers never need to know that

we also decided to expose the identifier inside the key because it helps support and debugging without weakening security

---

## secret length discussion

### question

how many random bytes should the api key secret contain?

### reflection

rather than searching for a "correct" number, the discussion focused on first principles

reasoning:

- too small increases guessing risk
- too large provides diminishing returns
- usability still matters

### decision

generate:

- 32 random bytes

encode using:

- base64 url-safe encoding

---

# migration problem

after adding the `identifier` column, drizzle generated:

```sql
alter table api_keys
add column identifier varchar(16) not null;
```

migration failed

### why?

the table already contained data

postgresql could not populate existing rows with a not null value

### resolution

since the project is still in an early stage and the existing rows were only test data:

```sql
truncate table api_keys;
```

migration then completed successfully

---

# tooling problem

`pnpm db:migrate` initially failed

cause:

`bcrypt`'s install script had been blocked by pnpm's build approval mechanism.

resolved by:

```bash
pnpm approve-builds
pnpm install
```

migration generation and execution then completed successfully

---

# lessons learned

## schema design ≠ schema evolution

designing a schema assumes an empty database

migrating a schema assumes existing customer data

those are fundamentally different engineering problems

---

## migration tools generate sql, not strategy

drizzle correctly detected the schema difference

it could not decide how existing data should be handled

migration strategy remains an engineering decision

---

## separation of responsibilities

today's utilities each have a single purpose

| utility                      | responsibility                   |
| ---------------------------- | -------------------------------- |
| `generateApiKeyIdentifier()` | generate lookup identifier       |
| `generateApiKeySecret()`     | generate cryptographic secret    |
| `buildApiKey()`              | assemble customer-facing api key |
| `hashApiKey()`               | hash secret before persistence   |

each function performs one job

---

# personal reflections

several observations shaped today's architecture

## api key lookup

> "the customer should only ever see one clean string"

this became the foundation of the api key format

---

## lookup strategy

> "the identifier exists primarily for the platform, not the customer"

this insight resolved the conflict between secure hashing and efficient lookup

---

## secret size

instead of looking for a magic number, the reasoning focused on balancing:

- security
- usability
- practicality

this naturally led to selecting 32 random bytes.

---

## product thinking

one particularly important realization:

the architecture should protect both:

- the customer experience
- operational simplicity for the engineering team

many implementation decisions today came from thinking like a product builder rather than only as a programmer

---

# final test

generated api key:

```text
{
  identifier: 'mk_1bc70960d5',
  secret: 'vwZ8P2lUcWWs--dw_NoGM4Dph1rkS1mFHRZzS1O_HqU',
  apiKey: 'mm_live_mk_1bc70960d5.vwZ8P2lUcWWs--dw_NoGM4Dph1rkS1mFHRZzS1O_HqU'
}
```

the generated key now resembles the style of production saas providers such as stripe and resend

---

# sprint outcome

sprint 4 established mailmonger's customer identity foundation

the project now has:

- customers
- api key storage
- api key architecture
- secure key generation
- identifier strategy
- hashing strategy

the remaining work is connecting these building blocks into a complete issuance and authentication pipeline

---

# sprint 5 preview

next sprint will implement the complete api key issuance flow

goals:

1. generate an api key
2. hash the secret
3. persist identifier and hash
4. return the complete api key exactly once
5. add repository, service and controller layers
6. verify the entire flow end-to-end


