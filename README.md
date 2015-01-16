# Firebase Chat Project

In this project, you'll create a chat room. By the end of it, you'll have a
Javascript program that defines a custom `<chat-room>` tag which you can use
in any page. 

You'll be using Firebase as the backend.

[Firebase](http://www.firebase.com) is a database with a few nifty features:
  * You can use it entirely from client side Javascript.
  * (You can also use it from server side Javascript.)
  * It's designed to handle synchronizing data between multiple users. Changes
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
  * Implementing custom tags.
    - These are a new and quite powerful web development tool for making
      modular components in web pages.
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
Github Pages.

Go [create a firebase account](https://www.firebase.com/account), and [go
through the 5-minute tutorial](https://www.firebase.com/tutorial/).

## Implement the chat room ##

The specs have already been written for you. Use them to figure out what needs
to be done. You can visit [SpecRunner.html](SpecRunner.html) to run them.

There are three main components: `<chat-room>`, `<chat-log>`, and `<chat-form>`.

`<chat-room>` is the main tag that we expect people to use in their pages. It
creates a `<chat-log>` and a `<chat-form>` inside it.

`<chat-log>` displays the messages in the chat room.

`<chat-form>` gets user input and posts messages to the room.

You can work on them in any order you like. I've sprinkled TODOs throughout
the code where work needs to be done. To find all of them, you can use grep:

    grep -n TODO chat-room.js

## Try connecting to someone else's room ##

Once you have your chat room working, try setting the db to someone else's
chat room. If you've both followed the protocol, it should work!

## Host your chat room on Github Pages ##

Hosting a static site on Github pages is easy. Create a `gh-pages` branch and
push it. Your site should appear at `<your username>.github.io/<repo name>`
shortly.

## The chat room protocol ##

Your chat room clients will push their messages into a Firebase database.
Firebase will handle syncing the messages between clients. If we decide on a
message format, then your chat room client will be able to connect to anyone's
Firebase. Your clients will be interoperable—it won't matter if you're using
my code or yours, we'll still be able to talk to each other.

So let's do that.

### Database structure ###

The structure of a Firebase is basically that of a giant JSON object, a tree
where every object in the database has some children, which are themselves
objects which can have children, and so on. Every object has its own URL.

A chat room is a Firebase object. It must have one child, `messages`, though
it may have others as defined by extensions to this protocol. `messages` is a
list of messages in the format defined below.. To post to the room, a client
pushes a message into this list.

### Message Format ###

Two fields are mandatory:

      ts: number, the time the message reached the database in
          milliseconds since the UNIX epoch
    user: string, the username of the user sending the message

All other fields are optional. To allow for extensibility, chat rooms must
not break when they encounter fields they do not understand.

There is no limit on the size of a message, except those imposed by Firebase.

Optional fields:

    msg: string, the text of a message from the user to the room

## Modularity and further work ##

You can use your new `<chat-room>` tag anywhere. Just include the Javascript
and CSS files and throw it in the page. It's a bit of a pain to have to
include multiple files, but [there are
ways](http://www.html5rocks.com/en/tutorials/webcomponents/imports/) around
that. If you were packaging this up as a library for other people to use,
you'd probably use a Javascript compiler to compile and minify all the
Javascript into one file, too.

Now that you have a basic working chat system, there's a lot you can do with
it.

### Presence ###

You could write and implement an extension to the protocol that handles
presence. Firebase has [functionality to support
this](https://www.firebase.com/docs/web/api/ondisconnect/), and it would let
you display a roster of everyone in the room.

### Authenticated users ###

You might have noticed that right now, anyone can pretend to be anyone else.
Firebase [supports authentication](https://www.firebase.com/docs/web/guide
/user-auth.html), so you could let users log in with Github (or Twitter or
Google or whatever) and display a badge next to authenticated users.

### Video ###

I was inspired to write this exercise when I made a hacky little project: a
viewing room. It was a chat room just like this one, only it also synchronized
the playback of a video (using the `<video>` element). You loaded, played, and
paused videos with commands like `/vid <url>`, `/play`, `/pause`, `/seek
<time>`, and so on. I extended the message format to include a `video` object
that held information about the video's URL, current time, and what command
the user had just run.

You could probably come up with a nicer interface, but this one was quick and
worked and let me watch TV with my friends across the country. You should make
one!
