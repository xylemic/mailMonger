# state transitions

## purpose

this document describes how business entities evolve throughout their lifecycle within mailMonger

rather than focusing on implementation deets, queues, or worker logic, this document defines the valid states that business entities may occupy and the business rules that govern movement between those states

the goal is to ensure that every component of the platform shares a consistent understanding of how business activity progresses from beginning to completion


## relationship to previous documents

the product blueprint explains why mailMonger exists

the system overview describes the conceptual lifecycle of an email request

the system architecture identifies the components responsible for executing that lifecycle

the domain Model defines the business concepts involved

the database design explains how those concepts are preserved

this document defines how those business concepts change over time as work progresses through the platform


## the philosophy of state

a state represents the current condition of a business entity at a particular moment in time

as work progresses through the platform, business entities move between valid states that reflect completed business responsibilities

state transitions should represent meaningful business progress rather than technical implementation deets

each transition should answer the question:

"what has become true that was not true before?"



## valid states

business entities should only occupy states that have clearly defined business meaning

every state should represent a condition that stakeholders can understand and reason about

states should not exist solely to simplify implementation

likewise, transitions should occur only when a genuine business event has taken place



## multiple state machines

mailMonger contains multiple state machines

different business entities progress through different lifecycles depending on their responsibilities

an email request progresses through the platform's internal processing lifecycle

a delivery progresses through the customer-visible delivery lifecycle

although these lifecycles are closely related, they represent different business concerns and should not be confused

separating these state machines allows the platform to model business behavior more accurately while keeping each lifecycle focused on a single responsibility


## the email request lifecycle

the email request represents the business instruction accepted from a customer

its lifecycle describes the progress of that instruction as mailMonger fulfills its responsibility to process the request

the states within this lifecycle represent internal business progress and are primarily intended for platform coordination, recovery, and operational visibility

they should not be confused with the customer-visible status of email delivery


### email request states

the lifecycle of an email request is intentionally small

each state represents a significant business milestone rather than an implementation step

the email request progresses through the following states:

- accepted
- queued
- processing
- completed

within each state, multiple implementation activities may occur

those activities contribute to business progress but do not themselves represent independent business states


### states are stable, work is transient

states represent durable business conditions

implementation work performed within a state is transient and may change as the platform evolves

adding new processing steps should not require introducing additional business states unless the business itself gains a new meaningful condition

keeping the state model small allows the platform to evolve internally without changing its external understanding of business progress


## the delivery lifecycle

while the email request tracks the platform's responsibility to process cusotmer work, the delivery lifecycle tracks the outcome of attempting to deliver an email

this lifecycle represents the statuses most meaningful to customers because it answers a simple question:

"what happened to my email?"

unlike the email request lifecycle, these states describe the progress and outcome of communication with external mail providers and recipient mall servers


### delivery states

a delivery progresses through a series of customer-visible states

each state represents a meaningful milestone in the attempt to deliver an email

the delivery lifecycle consists of:

- queued
- sending
- delivered
- deferred
- bounced
- complained
- failed


### queued

the delivery has been created and is waiting for a worker to begin communication with an email provider

no delivery attempt has yet been made

this state indicates that the platform has accepted responsibility for delivering the email but has not yet initiated transmission


### sending

mailMonger is actively attempting to deliver the email through an external email provider

during this state, the platform communicates with external infra and awaits the provider's response

successful completion of this state leads to either delivery or another outcome depending on the provider's response


### delivered

the receiving mail server has accepted the email

delivery represents successful completion of mailMonger's responsibility to transmit the message

acceptance by the receiving server does not necessarily guarantee that the recipient has opened or read the email


### deferred

delivery was temporarily delayed by the receiving infra

temporary conditions such as rate limits, greylisting, or transient service interruptions may cause delivery to be deferred

mailMonger may attempt delivery again according to its retry policy


### bounced

the receiving mail server rejected the delivery attempt

common reasons include invalid recipient addresses, nonexistent mailboxes, or recipient policies that prevent acceptance

a bounce records the response received from the external mail system



### complained

the recipient reported the delivered email as unwanted or spam

complaints negatively affect sender reputation and provide important feedback regarding mailing practices

mailMonger records complaints so customers can protect both deliverability and sender reputation


### failed

mailMonger has determined that delivery cannot be completed

this state represents the conclusion of the delivery lifecycle after all reasonable delivery attempts have been exhausted or an unrecoverable condition has occurred

once a delivery enters the failed state, no further delivery attempts will be made



## terminal states

not every state allows further progression

some states represent the natural conclusion of a delivery lifecycle

terminal states are:

- delivered
- bounced
- complained
- failed

once a delivery reaches a terminal state, the platform considers that delivery complete

no further transitions should occur unless a new delivery is created


## valid transitions

business entities should move only between states that represent legitimate business progress

not every transition is valid

allowing arbitrary movement between states can create inconsistencies, obscure the history of an email, and violate the business rules established by the platform

by explicitly defining valid transitions, mailMonger ensures that every state change reflects a meaningful business event


queued
    │
    ▼
sending
    │
    ├──────────────► delivered
    │
    ├──────────────► deferred
    │                     │
    │                     ▼
    │                  sending
    │
    ├──────────────► bounced
    │
    ├──────────────► complained
    │
    └──────────────► failed



### sending → failed

the platform has determined that delivery can no longer succeed

this may occur after retry attempts have been exhausted or an unrecoverable error has been encountered



## state transitions preserve business integrity

every transition within mailMonger should represent a genuine change in business reality

states should never be skipped, repeated unnecessarily, or changed solely for technical convenience

by enforcing well-defined state transitions, the platform maintains a consistent, auditable history of every business entity throughout its lifecycle

this discipline allows customers, operators, and engineers to reason about the system using the same shared understanding of business progress



