# project foundation

## purpose

this document records the major implementation decisions made while building mailMonger

the goal is not to justify every technology choice, but to explain the reasoning behind the core tools and architectural decisions that shape the project

these decisions provide consistency throughout implemetation and serve as a reference whenever future changes are considered


## implementation philosophy

implementation should reflect the principles established during the design phase

every technology introduced into the project should solve a real problem rather than follow industry trends

when multiple solutions exists, preference should be given to the option that best balances simplicity, maintainability, reliability, and long-term scalability

the objective is not to build the most sophosticated system possible, but to build a dependable system whose behavior is well understood



## choosing our technology stack

every technology included in mailMonger should have a clearly defined responsibility

the technology stack should remain as small as practical while providing the capabilities required to build a reliable email platform

the following sections explain the major implementation decisions made during the project's development


## runtime

### node.js

mailMonger is implemented on top of node.js

node.js provides an event-driven, asynchronous runtime that is well suited to applications responsible for coordinating large numbers of network operations

because much of mailMonger's work involves receiving requests, communication with databases, interacting with external email providers, and coordinating background processing, node.js allows the platform to remain responsive without requiring a separate thread for every request


## language

### typescript

mailMonger is implemented using typescript

as a software system grows, assumptions about the shape of data become increasingly difficult to manage

without a shared understanding of what info a business entity contains, different parts of the system may develop conflicting expectations, leading to defects that are often discovered only at runtime

typescript makes these assumptions explicit

business concepts such as email requests, deliveries, domains, templates, and provider responses can be described using shared types that are understood consistently throughout the codebase

this allows implementation errors to be identified during development rather than after deployment

using typescript also improves refactoring, documentation, and onboarding by making the contracts between different parts of the system visible to both engineers and development tools

the objective is not simply to add types, but to create a codebase whose behavior is easier to understand, evolve, and maintain as the platform grows



## package manager

### pnpm

mailMonger uses pnpm to manage project dependencies

a package manager provides a consistent and reproducible way to install, update, and share the external libraries required by the project

while several package managers exist within node.js ecosystem, pnpm was selected because it installs dependencies efficiently while maintaining strict dependency isolation

rather than duplicating packages across every project, pnpm stores downloaded packages in a shared content-addressable store and links them into individual projects

this approach reduces disk usage, improves installation speed, and encourages packages to declare their dependencies explicitly

using pnpm helps ensure that every development environment installs the same dependency versions, producing consistent behavior across machines and deployment environments



## web framework

### express

mailMonger uses express as its primary web framework

a web framework provides the infra required to receive http requests, route them to the appropriate business logic, and construct responses for customers

express was selected because it provides a simple, mature, and widely understood programming model while allowing the project to focus on solving business problems rather than framework complexity

although alternative frameworks may offer higher raw request throughput, the primary performance characteristics of mailMonger are determined by database operations, queue coordination, and communication with external email providers rather than request routing itself

for the current stage of the project, express provides the best balance of simplicity, ecosystem maturity, and maintainability

should future performance measurements identify the web framework as a genuine bottleneck, the implementation may be revisited based on evidence rather than assumption



## database

### postgresql

mailMonger uses postgresql as its primary database

the database serves as the persistent source of truth for the platform

it stores the business info required to fulfill the commitments made to customers, including accounts, verified domains, email requests, deliveries, events, templates, and suppression entries

postgresql was selected because it provides strong transactional guarantees, a mature relational data model, and reliable support for maintaining consistency between related business entities

the relationships between mailMonger's core concepts are central to the business itself

representing these relationships explicitly within a relational database helps preserve business integrity while simplifying querying, reporting, and future evolution of the platform

because accepting an email request represents a business commitment, durability and consistency are prioritized over raw write throughput

the objective is not simply to store data, but to preserve the promises made by the platform


