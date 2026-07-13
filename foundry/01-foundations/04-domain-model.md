# domain model

## purpose

this document defines the core business concepts that exist within the mailMonger platform

rather than describing databases or implementation deets, the domain model establishes the language used throughout the project, architecture, and codebase

by defining these concepts explicitly, mailMonger maintains a consistent understanding of the business domain across engineering, documentation, and future development 


## domain philosophy

mailMonger models business concepts rather than technical constructs

each concept in this document represents something that exists from the perspective of the customer or the business

implementation deets such as databases, queues, caches, and frameworks are intentionally excluded

the goal of this document is to define what exists, not how those concepts are implemented



## customer

a customer is an individual or organization that uses mailMonger to send and manage email communications


customers establish the business relationship with the platform

they create email requests, manage templates, configure delivery settings, monitor delivery outcomes, and access reports describing the health of their email operations

every email request belongs to exactly one customer

without a customer, no business activity exists within the platform


## api key

an api key represents a customer's identity when communicating with the mailMonger platform programmatically

it allows mailMonger to associate incoming email requests with the correct customer and enforce authentication, authorization, and usage policies

an api key belongs to exactly one customer

a customer may own multiple api keys for different applications, environments, pr operational purposes



## domain

a domain represents an email identity that a cutomer has authorized for use within mailMonger

before emails can be delivered on behalf of a domain, ownership must be verified according to the requirements of the selected delivery provider

domains establish trust between customers, recipients, and email providers

a customer may own multiple domains


## email request

an email request represents a customer's instruction to send an email

it contains all the info required for mailMonger to prepare, deliver, monitor, and report the lifecycle of that request

every email processed by the platform begins as an email request

an email request may reference a template or provide email content directly

once accepted by the platform, an email request progresses through the processing lifecycle until it reaches a final outcome

the email request is the central business object around which the entire platform is organized

every email request belongs to exactly one customer



## delivery

a delivery represents an attempt to deliver an email request to a recipient 

it records the operational outcome of that attempt, including its current status and any info returned by the external delivery provider

a single email request may result in one or more deliveries, depending on retry policies, multiple recipients, or future platform capabilities

every delivery belongs to exactly one email request



## event

an event represents a significant occurrence in the lifecycle of a delivery

events describe changes such as successful submission, delivery, temporary failure, permanent failure, bounce, complaint, or other provider notifications

events provide the historical record that allows mailMonger to track, audit, and report on delivery activity

every event belongs to exactly one delivery


## template

a template represents a reusable email design that can be referenced by one or more email requests

templates allow customers to separate email presentation from the data used to personalize each message

a template may contain placeholders that are populated with customer-provided variables during email preparation

a customer may own multiple templates

an email request may reference one template or provide its content directly 


## attachment

an attachment represents a file that accompanies an email request during delivery

attachments form part of the content delivered to recipients but do not exist independently of an email request

an email request may contain zero or more attachments

every attachment belongs to exactly one email request



## report

a report represents a business view of email activity within mailMonger

reports summarize information derived from email requests, deliveries, and events to help customers understand the performance and reliability of their email operations

reports are generated from existing operational data rather than creating new business activity



## domain principles

the domain model of mailMonger is guided by a small number of principles that shape how business concepts are defined and related

- every business activity originates from a customer
- the email request is the central business transaction within the platform
- supporting concepts either enable, enrich, or record the lifecycle of an email request
- domain concepts represent business meaning rather than technical implementation
- business relationships should reflect ownership and resposibility within the domain
- the domain model should remain stable even as technologies and implementation deets evolve



## what was learned

the domain model defines the language of mailMonger

by identifying the core business concepts and the relationships between them, we establish a shared understanding that guides architecture, database design, APIs, and implementation

a well-defined domain allows the platform to evolve without losing sight of the business it exists to serve




