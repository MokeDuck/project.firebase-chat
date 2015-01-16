# exercise.firebase-chat

In this project, you'll create a chat room. By the end of it, you'll have a
Javascript program that defines a custom `<chat-room>` tag which you can use
in any page. 

You'll be using Firebase as the backend.

[Firebase](http://www.firebase.com) is a database with a few nifty features:
  * You can use it entirely from client side Javascript.
  * (You can also use it from server side Javascript.)
  * It's designed to handle synchronizing data between multiple users.Changes
    to the database are broadcast to all connected clients in real time (think
    Google Docs).
  * It stores structured, JSON-like data.
  * It's run as a web service. That means it's someone else's problem if it breaks.

These features make it great for implementing a chat room.

## Learning Goals ##
  * Get comfy with Javascript and current best practices.
    - Don't panic! chat-room.js has a lot of code for the specs. The code to
      implement the chat room is actually much smaller.
    - The specs are there for a reason: read them and use them to guide your
      development.
  * Javascript events and callbacks.
    - What happens when the chat form is submitted?
    - What happens when data in Firebase changes?
    - In general, when are event listeners called?
  * Javascript testing with Jasmine.
    - How do the specs isolate each component and test its behavior?
    - How do they test interaction with external components like Firebase?
  * NoSQL databases
    - What is the structure of data in Firebase? How does it differ
      from a relational database?
    - Pros and cons? When would you use either?
  * Understand how well defined protocols help interoperability.
    - Why did I go to the admittedly minimal effort of defining a message
      format? Why not let everyone come up with their own?

## Setup: Make your repo and create a Firebase account ##

Fork this repo. Don't simply branch it. The reason I'm asking you to do things
this way is that by forking it, you'll be able to easily host your project on
Github Pages

Go [create a firebase account](https://www.firebase.com/account), and [go
through the 5-minute tutorial](https://www.firebase.com/tutorial/).


## The chat room protocol ##

Your chat room clients will push their messages into a Firebase database.
Firebase will handle syncing the messages between clients. If we decide on a
message format, then your chat room client will be able to connect to anyone's
Firebase. Your clients will be interoperable—it won't matter if you're using
my code or yours, we'll still be able to talk to each other.

So let's do that.

### Message Format ###

Two fields are mandatory:

    ts: number,  the message reached the database in
        milliseconds since the UNIX epoch
    user: string, the username of the user sending the message

All other fields are optional. To allow for extensibility, chat rooms must
not break when they encounter fields they do not understand.

There is no limit on the size of a message, except those imposed by Firebase.

Optional fields:

    msg: string, the text of a message from the user to the room
