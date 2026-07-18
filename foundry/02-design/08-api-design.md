# api design

## purpose

this document defines the external interface through with customers interact with mailMonger

rather than describing implementation deets, this doc specifies the capabilities exposed by the platform, the resources customers may interact with, and the contracts that govern those interactions

the goal is to provide a consistent, predictable, and implementation-independent interface between customers and platform


## relationship to previous documents

the product blueprint defines the business problems mailMonger solves

the system overview describes how an email request progresses through the platform

the system architecture identifies the components responsible for processing requests

the domain model defines the business concepts exposed by the platform

the database design explains how those concepts are preserved

the state transitions document defines how those concepts evolve over time

this document describes how customers interact with those business concepts through the api


## api philosophy

the api exists to expose business capabilities rather than internal implementation

customers interact with business concepts such as email request, templates, domains, and api keys

they should never be required to understand queues, workers, persistence strategies, or other internal mechanisms

a well-designed api allows customers to accomplish business objectives while remaining independent of how the platform fulfills those objectives


## the api is a contract

the api represents a long-term agreement between mailMonger and its customer

every endpoint, request, and response forms part of that agreement

internal implementation may evolve over time, but the contract presented to customers should remain as stable as possible

maintaining a stable contract allows customer applications to evolve independently of changes within the platform


## business capabilities

the api exists to allow customers to perform a small number of well-defined business operations

each operation should correspond to a meaningful business objective rather than an internal system activity

the api exposes the business capabilities required for customers to establish trust, send email, and monitor delivery

these capabilities are presented in the same order that customers naturally adopt the platform:

- managing customer accounts
- managing api keys
- verifying sending domains
- submitting email requests
- monitoring delivery outcomes
- managing templates
- managing suppression lists


## trust before delivery

before mailMonger accepts responsibility for delivering email on behalf of a customer, the platform must establish that the customer is authorized to send using the requested domain

this protects both the customer's sender reputation and the reputation of the platform as a whole

establishing trust before delivery is a fundamental responsibility of the platform rather than an optional security feature


## the api promise

every request received by the api represents a business request from a customer

the api's responsibility is to determine whether that request can be accepted

if the request satisfies the platform's business rules, mailMonger accepts responsibility for fulfilling it

accepting a request does not necessarily mean the requested work has already been completed

rather, it means the platform has committed to processing the request according to the guarantees established by the product


## synchronous acceptance, asynchronous execution

the api performs only the work necessary to determine whether a request can be accepted

once accepted, responsibility for completing the work passes to the platform's asynchronous processing components

this approach allows the api to remain responsive while enabling the platform to perform potentially long-running operations independently of customer response times

customers receive confirmation that responsibility has been accepted rather than waiting for the entire operation to complete


## resources over actions

the api should expose business resources rather than internal operations

customers interact with email requests, domains, templates, api keys, and deliveries

they should not invoke implementation-specific actions such as queue processing, worker execution, or retry mechanisms

the platform determines how business requests are fulfilled while presenting customers with a stable and predictable interface



## primary resources

mailMonger exposes a small number of business resources

each resource represents a business concept rather than a technical component

the primary resources are:

- customers
- api keys
- domains
- email requests
- deliveries
- templates
- suppression entries


### email requests

email requests are the primary resource of the platform

customers create email requests to instruct mailMonger to deliver email on their behalf

once accepted, an email request progresses through the lifecycle defined in the state transitions document

customers may inspect the current state of an email request and its associated deliveries, but they do not directly control the platform's internal processing


### domains

domains establish the customer's authority to send email

before an email request can be accepted, the associated sending domain must satisfy the platform's verification requirements

verified domains form the trust foundation upon which reliable email delivery depends



