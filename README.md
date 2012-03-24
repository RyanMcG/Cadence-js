# Cadence.js
## A typing style monitor for input fields
#### Author: Ryan McGowan

### A Quick Synopsis

Cadence.js is a simple js library for compiling user keystrokes and timing into
JSON for server-side interpretation.

The envisioned purpose is authentication.  Every person types with a specific
style.  Many people type their passwords with a very specific *cadence*.
**Cadece.js** simply hopes to capture and return the necessary information for
server-side analysis and authentication.

### Why?

Well, first of all it was not my idea.  I read this article by [The New York
Times](http://www.nytimes.com/2012/03/18/business/seeking-ways-to-make-computer-passwords-unnecessary.html?_r=4&ref=technology)
and I liked the idea.  However, the involved technology is pretty advanced and
nowhere near full proof enough for authentication on any website in production.
Marrying they industry standard password authentication with, what could be
transparent, "typing style" authentication is the obvious next step.  

Cadence helps you do that.

### What does it do exactly?

It monitors keystrokes and their timings and compiles them into a JSON object
that can be handed off along with the content of an input field.  Once it's
server-side Cadence's work is done and the server-side application is charged
with handling authentication.

### If you are interested in learning more. . .

*   [Authentication via Keystroke Dynamics](http://avirubin.com/keystroke.ps)
