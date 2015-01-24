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

## Design ##

We're going to define three custom HTML elements: `<chat-room>`, `<chat-log>`,
and `<chat-form>`. We'll also use `<chat-message>` tags to hold our chat
messages, but we don't have to write any Javascript to support them, because
they're just displaying some content.

If you look in [index.html](index.html), you'll see that it has a `<chat-room>`
in it:

    <chat-room db="https://your-firebase.firebaseio.com/" id="room">
    </chat-room>

That's all we have to type into our HTML to create a chat room. We'll write
Javascript that defines how the `<chat-room>` tag should behave. Our
Javascript will create `<chat-log>` and `<chat-form>` elements and append them
to the chat room, so the DOM will ultimately look like this:

    <chat-room db="http://some-firebase.firebase.com">
      <!-- These elements are created in Javascript -->
      <chat-log>
      </chat-log>
      <chat-form>
        <form>
          <input type="text" class="username">
          <input type="text" class="message">
          <input type="submit">
        </form>
      </chat-form>
    </chat-form>

We'll get chat messages by listening for changes to Firebase. When a new
message comes in, we'll make a `<chat-message>` element and append it to the
log, like so:

    <chat-room db="http://some-firebase.firebase.com">
      <chat-log>
        <!-- new chat message: -->
        <chat-message user="ashi" timestamp="12345436456">Hi</chat-message>
      </chat-log>
      <chat-form>
        <form>
          <input type="text" class="username">
          <input type="text" class="message">
          <input type="submit">
        </form>
      </chat-form>
    </chat-form>

## 1. Fork this repo ##

Don't simply branch it. The reason I'm asking you to do things
this way is that by forking it, you'll be able to easily host your project on
Github Pages.

## 2. Create a Firebase account and do their tutorial ##

[Create a firebase account](https://www.firebase.com/account). [Go
through the 5-minute tutorial](https://www.firebase.com/tutorial/).

## 3. Make the chat log ##

First, let's get the chat log working. You'll see find the code in
[src/chat-log.js](src/chat-log.js). You can run the specs by opening
[SpecRunner.html](SpecRunner.html).

Your chat log's append function should take messages of the format `{ user: "username", ts: timestamp, msg: "message" }`. The format is described in more detail at the end of this readme.

You'll want to use [document.createElement](https://developer.mozilla.org/en-US/docs/Web/API/document.createElement) to create the message elements and [setAttribute](https://developer.mozilla.org/en-US/docs/Web/API/Element.setAttribute) to set their attributes. There are many more sophisticated HTML template systems, but we're only creating a few elements in this project, so let's do it the old fashioned way.

You can test out your log with [chat-log-test.html](chat-log-test.html), which is just an empty
document with a `<chat-log>` in it. You should be able to call `log.append({user: 'ashi', ts: 0, msg: 'hi'})` and see a message pop up.

## 4. Make the chat room ##

Add [spec/chat-room-spec.js](spec/chat-room-spec.js) to [SpecRunner.html](SpecRunner.html)
and make those tests pass.

You'll need to [create a Firebase ref](https://www.firebase.com/docs/web/api/firebase/constructor.html), [get a reference to the "messages" child](https://www.firebase.com/docs/web/api/firebase/child.html), and [listen for "child_added"](https://www.firebase.com/docs/web/api/query/on.html).

You can test out your room in [index.html](index.html). You don't have a working chat form yet, but if you go to your Firebase dashboard, you should be able to create a "messages" node, add messages to it, and see them pop up in your chat room.

## 5. Make the chat form ##

Add [spec/chat-form-spec.js](spec/chat-form-spec.js) to [SpecRunner.html](SpecRunner.html)
and make those tests pass.

Once it's working, your chat room should be working.

## 6. Try connecting to someone else's chat room ##

Once you have your chat room working, try setting the db attribute to someone
else's chat room. If you've both followed the protocol, it should work!

## 7. Host your chat room on Github Pages ##

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