# database design

## purpose

this document describes the design principles that govern how info is stored within mailMonger

rather than focusing on implementation deets or specific database technologies, this document explains what info the platform must preserve, why it must be preserved, and how persistent storage supports the business responsibilities established in previous design documents

the goal is to design a database that faithfully represents the business domain while providing a reliable foundation for future implementation


## relationship to previous docs

the product blueprint defines why mailMonger exists

the system overview describes the lifecycle of an email request

the system architecture explains the components responsible for implementating that lifecycle

the domain model defines the business concepts that exist within the platform

this document describes how those business concepts are represented as persistent data


## database philosophy

the database exists to preserve business truth

it is the authoritative source of info about customers, email requests, deliveries, templates, domains, events, and other business concepts

the database should accurately represent the business domain rather than the implemetation deets of the application

every piece of persistent data should exist because it serves a meaningful business purpose


## categories of persistent data

not all info held by mailMonger has the same importance

some data represents business commitments that must never be lost

other data can be reconstructed if necessary

the database should prioritize preserving info that maitains customer trust and ensures the continuity of business operations


### critical business data

critical business data represents info that cannot be recreated without damaging customer trust or business continuity

examples include:

- customer accounts
- api keys
- verified domains
- accepted email requests
- delivery history
- suppression lists
- reputation-related info


### operational data

operational data supports the day-to-day operation of the platform but can usually be recreated or rebuilt

examples include:

- cached info
- queue state
- temporary processing metadata
- rate limiting counters
- distributed locks


### derived data

derived data is produced from existing business infor rather than representing new business activity

examples include:

- dashboards
- analytics
- reports
- aggregated stats

because derived data can be regenerated from persistent business records, it generally requires less protection than critical business data


## the principle of business commitment

whenever 

mailMonger accepts responsibility for a customer's request, the info representing that commitment must be persisted before further processing begins

the platform should never acknowledge responsibility for work that it cannot recover after an unexpected failure

persisting business commitments before asynchronous processing protects customer trust and allows the system to recover safely from infra failures


---

one useful way to identify what belongs in persistent storage is to imagine the platform recovering from a complete system failure

info that cannot be recreated without violating customer trust, losing business commitments, or damaging long-term deliverability should be treated as persistent business data

thinking about failure often reveals what the business truly values


---


## the source of truth

the database serves as mailMonger's source of truth

whenever uncertainty exists about the state of the platform, the database provides the authoritative record of business activity

operational components such as queues, caches, and background workers may temporarily hold info while work is in progress, but they should never become the authoritative owner of business data

if operational state is lost, the system should be able to recover by consulting the persistent records stored in the database

for this reason, every significant business event should ultimately be reflected in persistent storage


## persit facts, not views

the database should persist business facts rather than their presentations

facts represent things that actually happened within the business

views, summaries, dashboards, and reports should generally be generated from those facts rather than stored independently

by preserving facts instead of derived representations, mailMonger maintains consistency while reducing duplication


## mapping the domain to persistence

the domain model describes the business concepts that exist within mailMonger

the database represents those concepts as persistent records

although many business concepts naturally become database tables, the relationship is not always one-to-one

some concepts are stored directly because they represent business facts

other concepts are derived from existing data and therefore do not require independent persistence

the decision to persist a concept should be based on its business significance, ownership, and role in preserving customer commitments rather than convenience during implementation


## first-class persistence entities

the following business concepts represent foundational records within the platform and therefore require persistent storage

- customer
- api key
- domain
- email request
- delivery
- event
- template
- attachment


each of these entities represents info that cannot be reconstructed without losing business meaning, customer commitments, or operational history


## ownership and relationships

persistent entities should reflect the ownership and responsibility that exist within the business domain

relationships are established because one business concept owns, depends upon, or gives meaning to another

these relationships should remain consistent across the domain model, the database schema, and the implementation

by modeling ownership explicitly, mailMonger preserves both referential integrity and the natural structure of the business


### customer

the customer is the highest-level business entity within the platform

every other persistent business entity ultimately belongs to a customer, either directly or indirectly

cutomers own:

- api keys
- domains
- templates
- email requests

through email requests, customers also own:

- attachments
- deliveries
- events


### email request

the email request is the central business transaction recorded by the platform

every email request belongs to exactly one customer

an email request may reference one template

an email request may contain zero or more attachments

an email request may result in one or more deliveries


### delivery

a delivery represents an operational attempt to fulfill an email request

every delivery belongs to exactly one email request

a delivery may generate one or more events through its lifecycle


### event

an event records a significant occurrence during the lifecycle of a delivery

every event belongs to exactly one delivery

events provide the historical record from which delivery status, reporting, and operational insight are derived


## modeling business relationships

mailMonger models business relationships using a relational approach

rather than storing isolated pieces of info, the database preserves the natural relationships that exist between business concepts

each persistent entity maintains only the info that belongs to it, while relationships connect those entities into a consitent representation of the business

this approach reduces duplication, improves consitency, and allows the platform to answer complex business questions using a single authoritative source of truth


### normalize around ownership

each business concept should own its own info

info should exist in one authoritative location and be referenced by related entities rather than duplicated throughout the database

for example, a customer owns its identity, a domain owns its verification status, and an email request owns the business instruction to deliver an email

this separation reduces inconsistency while allowing each concept to evolve independently



### relationships preserve meaning

individual records rarely provide enough context to explain business activity

the meaning of an email request, a delivery, or an event emerges from its relationship to other business entities

for this reason, relationships are treated as first-class aspects of the database design rather than implementation deets

maintaining these relationships allows the platform to reconstruct the complete lifecycle of every business transaction


### preserve history

business history should be preserved rather than overwritten whenever practical

the database should record what happened instead of only reflecting the current state

historical records allow mailMonger to audit business activity, investigate operational issues, generate reports, and understand the complete lifecycle of customer requests

whenever a significant business event occurs, the preferred approach is to record the event rather than discard the previous info


customer
├── api key
├── domain
├── template
└── email request
      ├── attachment
      └── delivery
             └── event


the database is organized around the customer and the email request

supporting entities either define customer identity, enable email preparation, or record the operational history of each request

this organization reflects the natural ownership relationship within the business rather than arbitrary technical groupings


## identity

every persistent entity within mailMonger requires a stable identity

identity allows the platform to distinguish one business entity from another, maintain relationships between records, and preserve historical info throughout the lifetime of the system

an entity's identity should remain constant even if its attributes change over time

changing an email address does not create a new customer

updating a template does not create a new template

verifying a domain does not create a new domain

identity represents the continuity of the business entity rather than its current state


### identity is immutable

once assigned, the identity of a business entity should never change

attributes may evolve throughout the lifetime of the entity, but its identity remains stable

stable identities allow relationships between entities to remain valid regardless of how business info changes over time

this principle simplifies system design, preserves historical accuracy, and supports relaible auditing



### identity and state

identity should not be confused with state

state describes the current condition of a business entity

identity describes which entity that state belongs to

while state changes throughout the lifetime of the platform, identity remains constant

separating identity from state allows the system to preserve business history while accurately representing the current condition of every entity


### business identity and technical identity

some business entities possess identifiers that are meaningful outside the platform, while others require identifiers created solely by the system

for example, a verified domain has a business identity represented by its domain name, while the platform may also assign its own internal identifier to manage relationships efficiently

distinguishing business identity from technical identity allows the database to evolve without coupling internal implementation to externally meaningful values


### relationships depend on identity

relationships between persistent entities should always be established through stable identities rather than mutable business attributes

because identities do not change, the relationships between customers, domains, email requests, deliveries, and events remain consistent even as their individual states evolve

stable identities provide the foundation upon which the entire relational model is built


## from concepts to tables

the domain model identifies the business concepts that exist within mailMonger

the database design determines which of those concepts require persistent representation

not every concept within the business domain necessarily becomes a database table

a concept should be represented as its own persistent entity only when it possesses a stable identity, owns information, represents a business fact, or preserves a business commitment

applying these principles ensures that the database reflects the business itself rather than the convenience of implementation



| domain concept | persist? | reason                                                       |
| -------------- | -------- | ------------------------------------------------------------ |
| customer       | yes      | owns business relationships and system access                |
| api key        | yes      | represents authentication credentials and customer ownership |
| domain         | yes      | represents verified sender identity                          |
| email request  | yes      | represents the customer's business commitment                |
| delivery       | yes      | records delivery attempts                                    |
| event          | yes      | preserves historical business activity                       |
| template       | yes      | represents reusable customer assets                          |
| attachment     | yes      | represents content associated with an email request          |
| Report         | no       | derived from persistent business facts                       |



reports do not represent independent business facts

instead, they summarize or interpret information already preserved elsewhere within the platform

for this reason, reports should generally be generated from persistent business records rather than stored as independent entities

this approach minimizes duplication while ensuring that reporting always reflects the authoritative business history


## tables should represent ownership

each persistent entity should own a clearly defined portion of the business domain

a table should exist because it is responsible for preserving information that no other entity owns

whenever multiple tables appear to own the same information, the database design should be reconsidered to reduce duplication and clarify responsibility

clear ownership produces a database that is easier to understand, maintain, and evolve


## looking ahead

the principles established in this document provide the foundation for the physical database schema

future design documents will translate these persistent entities into relational tables, define their attributes, establish constraints, and describe how the platform maintains consistency as business activity evolves

by separating conceptual database design from implementation, mailMonger ensures that future engineering decisions remain grounded in business requirements rather than technical convenience


