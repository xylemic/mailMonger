# ubiquitous language

## purpose

this document defines the shared vocaulary used throughout mailMonger

every important business concept should have one clear meaning that is consistently used across documentation, architecture, code, APIs, and conversations

by establishing a ubiquitous language, mailMonger reduces ambiguity and improves communication between engineers, product stakeholders, and future contributors


## why this matters

software projects often become difficult to maintain because different people use the same words to mean different things

mailMonger avoids this by assigning precise meanings to the concepts that define the business

when everyone uses the same language, architectural discussions become clearer, implementation decisions become easier, and documentation remains consistent


## customer

a customer is an individual or organization that has a business relationship with mailMonger

customers own api keys, domains, templates, email requests, and reports


## email request

an email request is a customer's instruction asking mailMonger to deliver an email

an email request is accepted once the platform has validated and persisted it

an email request is not the same as delivery


## delivery

a delivery represents an attempt to send an email request to a recipient

a delivery records the operational outcome of that attempt

a delivery is not an email request


## event

an event represents something that happened during the lifecycle of a delivery

events describe observations

they do not represent business requests


## template

a template is a reusable email design that may be referenced by an email request 

templates do not represent emails themselves

they are resources used during email preparation

## preferred terminology

throughout the project, the following terms should be used consistently

| preferred     | avoid        |
| ------------- | ------------ |
| customer      | user         |
| email request | email        |
| delivery      | send         |
| event         | callback     |
| provider      | smtp service |
| template      | html email   |



