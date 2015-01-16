'use strict';  // http://speakingjs.com/es5/ch07.html#strict_mode

// If the Chat namespace object doesn't exist, define it.
var Chat = Chat || {};

// This admittedly odd construction is a common way of defining modules in
// Javascript. What's happening is: we're putting our module code inside a
// function literal, which we then immediately call at the bottom of the
// module. The function returns whatever we want to export from the module.
// This lets us use whatever variable names we want within the module without
// sullying the window namespace.
Chat.Room = (function() {
  // Testing: Jasmine provides the `describe` function to define specs. If
  // we're not running under Jasmine, assign describe to an empty function,
  // which will do nothing. This lets us put our specs in our source file.
  // Putting specs in source files is not standard practice, but I like having
  // my specs close at hand while I write my code.
  var describe = window.describe || function() { };
  
  /***** <chat-room> *****/
  // The <chat-room> tag is an interactive chat room that relays and stores its
  // messages via Firebase.
  //
  // Attributes: `db` is the URL of the Firebase node which will act as a
  // message store.
  //
  // Example markup:
  //   <chat-room db="https://resplendent-glacier-9238.firebaseio.com/">
  //   </chat-room>
  //
  // Example JS:
  //   var chat = new Chat.Room();
  //   document.querySelector('#some-container').appendChild(chat);
  //
  // When constructed empty, a <chat-room> will automatically create a
  // <chat-log> and <chat-form> inside itself.
  describe('<chat-room>', function() {
    it('can be created with document.createElement or new Chat.Room', function() {
      expect(document.createElement('chat-room').constructor)
      .toBe(Chat.Room);
    });
  
    var room;
    beforeEach(function() {
      room = new Chat.Room();
    });
  
    it('has a <chat-log>', function() {
      expect(room.querySelector('chat-log')).not.toBeNull();
      expect(room.querySelector('chat-log')).toBe(room.log);
    });
  
    it('has a <chat-form>', function() {
      expect(room.querySelector('chat-form')).not.toBeNull();
      expect(room.querySelector('chat-form')).toBe(room.form);
    });
  
    describe('using Firebase', function() {
      beforeAll(function() {
        // MockFirebase is an implementation of Firebase that just stores data
        // in Javascript objects. It's totally non-persistent storage with the
        // same interface as our real database--great for testing!
        // MockFirebase.override() replace window.Firebase with MockFirebase,
        // so we can run tests without hitting an actual firebase and filling
        // it with test data.
        MockFirebase.override();
      });
  
      it('has a db property, a Firebase ref that starts null', function() {
        expect(room.db).toBeNull();
      });
  
      describe('connecting to Firebase', function() {
        it('with the db attribute on <chat-room>', function() {
          room.setAttribute('db', 'http://example.firebase');
          expect(room.db).not.toBeNull();
        });
    
        it('with <chat-room>.connect', function() {
          room.connect('http://example.firebase');
          expect(room.db).not.toBeNull();
        });
      });
  
      describe('a connected <chat-room>', function() {
        var msg = {ts: 10000, user: 'audre', msg: 'I do not dwell'};
        beforeEach(function() {
          room.connect('http://example.firebase');
        });
  
        it("appends messages to the log when they're pushed to db/messages", function() {
          spyOn(room.log, 'append');
          room.db.child('messages').push(msg);
          // flush is a MockFirebase function that dispatches all pending
          // Firebase events. Normally they would trigger asynchronously, when
          // data arrived from the server.
          room.db.flush();
          expect(room.log.append).toHaveBeenCalledWith(msg);
        });
  
        describe('<chat-room>.post', function() {
          it('posts message to the db', function() {
            room.post(msg);
            room.post(msg);
            room.post(msg);
            room.db.flush();
            var children = room.db.child('messages').getData();
            expect(Object.keys(children).length).toBe(3);
          });
        });
      });
  
      afterAll(function() {
        // Restore normal Firebase functionality.
        MockFirebase.restore();
      });
    });
  });
  
  // Object.create create a new object with the specified prototype. In this
  // case, we're creating a new object with HTMLElement as its prototype.
  //
  // This is how Javascript does inheritance.
  //
  // We're going to add our functions to this object and then pass it to
  // document.registerElement to use as the prototype for <chat-room> tags.
  var Room = Object.create(HTMLElement.prototype);
  
  // When creating a custom tag, we don't get to define our own constructor,
  // because the object in question may already exist and be sitting in the
  // document. Instead, we get lifecycle callbacks.
  //   - createdCallback when a new instance of our element is created,
  //   - attachedCallback when it's attached to the document,
  //   - detachedCallback when it's removed from the document,
  //   - attributeChangedCallback(attr, oldValue, newValue) when an attribute is
  //     changed.
  //
  // There is no destroyedCallback, because in Javascript, as in many garbage
  // collected languages, there is no way to tell when an object is destroyed.
  //
  //   See: http://www.html5rocks.com/en/tutorials/webcomponents/customelements/#lifecycle  

  // createdCallback is called by the browser when a new <chat-room> is
  // created. (It is also called for all <chat-room>s in the document).
  Room.createdCallback = function() {
    this.log = this.querySelector('chat-log') || new Chat.Log();
    this.appendChild(this.log);
    this.appendChild(this.form = document.createElement('chat-form'));
    this.connect(this.getAttribute('db'));
  };
  
  // Called by the browser when an attribute value is changed on a
  // <chat-room>. Note that this isn't called for the original attribute
  // values.
  Room.attributeChangedCallback = function(attr, oldVal, newVal) {
    switch (attr) {
      case 'db':
        this.connect(newVal);
        break;
    }
  };
  
  // Connect to a Firebase and set <chat-room>.db to be a reference to it.
  Room.connect = function(url) {
    if (url) {
      this.db = new Firebase(url);
  
      this.db.child('messages').on('child_added', function(snap) {
        this.log.append(snap.val());
      }.bind(this));
    } else {
      this.db = null;
    }
  };
  
  // Send a message to the server.
  // Message is a chat room protocol message (see README.md).
  Room.post = function(message) {
    this.db.child('messages').push(message);
    // TODO
  };
  
  // Register our element. All <chat-room> tags will now use our prototype.
  // document.registerElement returns a constructor function for <chat-room>
  // elements.
  return document.registerElement('chat-room', { prototype: Room });
})();
/***** </chat-room> ******/

/***** <chat-log> *****/
// The <chat-log> tag holds a log of <chat-messages>. It is a slightly
// glorified list. It has two methods:
//
//   - append, which takes a message object and appends it to the log.
//   - clear, which removes all messages in the log
//
// <chat-room> elements create their own <chat-logs>, so there is little need
// to ever create one directly.
//
// Example:
//
//  var log = new Chat.Log();
//  log.append({ ts: 12389384, user: 'ashi', msg: 'hi.' });
Chat.Log = (function() {
  var describe = window.describe || function() { };
  describe('<chat-log>', function() {
    describe('<chat-log>.append', function() {
      var log;
      beforeEach(function() { log = new Chat.Log(); })
    
      it('returns a <chat-message> node with attributes and content', function() {
        var msg = {ts: 10, user: 'audre', msg: 'I do not dwell'};
        var node = log.append(msg);
        expectNodeShowsMessage(node, msg);
      });
    
      it('appends the <chat-message> to the room', function() {
        var msg = log.append({ts: 10, user: 'audre', msg: 'I do not dwell'});
        expect(log.contains(msg)).toBe(true);
      });
    
      it('appends messages in order received regardless of timestamp', function() {
        var testMsgs = [
          { ts: 10, user: 'audre', msg: 'I do not dwell' },
          { ts: 20, user: 'audre', msg: 'within my birth nor my divinities' },
          { ts: 15, user: 'audre', msg: 'who am ageless and half-grown' },
        ];
        testMsgs.map(log.append.bind(log));
        var appended = log.querySelectorAll('chat-message');
        expect(appended.length).toBe(testMsgs.length);
        var i = testMsgs.length; while(--i) {
          expectNodeShowsMessage(appended[i], testMsgs[i]);
        }
      });
  
      it('can be cleared with clear', function() {
        var testMsgs = [
          { ts: 10, user: 'audre', msg: 'I do not dwell' },
          { ts: 20, user: 'audre', msg: 'within my birth nor my divinities' },
          { ts: 15, user: 'audre', msg: 'who am ageless and half-grown' },
        ];
        testMsgs.map(log.append.bind(log));
        log.clear();
        expect(log.querySelector('chat-message')).toBeNull();
      });
  
      // Spec helper function. Takes a node and a message and expects that the node
      // is a <chat-message> with the relevant data conatined in the message.
      function expectNodeShowsMessage(node, msg) {
        expect(node instanceof HTMLElement);
        expect(node.tagName).toBe('CHAT-MESSAGE');
        expect(node.attributes.timestamp.value * 1).toEqual(msg.ts);
        expect(node.attributes.user.value).toEqual(msg.user);
        expect(node.textContent).toBe(msg.msg);
      }
    });
  });
  
  // <chat-log> extends HTMLElement.
  var Log = Object.create(HTMLElement.prototype);
  
  // Take a message, create a new <chat-message>, append it to the chat
  // log and scroll the log to the bottom.
  //
  // Returns the created <chat-message>.
  // Message is a chat room protocol message (see README.md).
  Log.append = function(message) {
    // TODO
    var msg = document.createElement('chat-message');
    msg.setAttribute('timestamp', message.ts);
    msg.dataset.timestamp = message.ts;
    msg.setAttribute('user', message.user);
    msg.textContent = message.msg;
    this.appendChild(msg);
    this.scrollTop = this.scrollHeight;
    return msg;
  };
  
  Log.clear = function() {
    var msgs = this.querySelectorAll('chat-message');
    var i = msgs.length; while(--i >= 0) {
      this.removeChild(msgs[i]);
    }
  };
  
  // Register <chat-log> and return the constructor.
  return document.registerElement('chat-log', { prototype: Log });
})();
/***** </chat-log> *****/

/***** <chat-form> *****/
// The <chat-form> tag gives users a place to enter their username and a
// message, which is posted to the enclosing <chat-room> when the user
// hits enter.
//
// A <chat-form> must be contained by a <chat-room>, and <chat-room>s
// create <chat-forms> if needed, so there is little reason to ever create
// one directly.
//
// Relevant methods:
//   - submit, which posts the current content of the form.
Chat.Form = (function() {
  var describe = window.describe || describe;
  describe('<chat-form>', function() {
    var form, room;
    beforeEach(function() {
      form = new Chat.Form();
      // A mock room. We could just create a <chat-room> and use the 
      // <chat-form> it creates, but that would make these tests fail if
      // <chat-room> is broken. Creating a mock room promotes isolation.
      room = document.createElement('x-mock-chatroom');
      room.post = function() { };
  
      room.appendChild(form);
    });
  
    it('has username and message input fields and properties', function() {
      expect(form).toEqual(jasmine.objectContaining({
        username: jasmine.any(HTMLElement),
        message: jasmine.any(HTMLElement),
      }));
      expect(form.contains(form.username)).toBe(true);
      expect(form.contains(form.message)).toBe(true);
    });
  
    describe('<chat-form>.submit', function() {
      var username = 'audre';
      var message = 'I do not dwell';
      var msgMatch = jasmine.objectContaining({
        user: username,
        msg: message,
      });

      it('returns a message', function() {
        form.username.value = username;
        form.message.value = message;
        var msg = form.submit();
        expect(msg).toEqual(msgMatch);
      });

      it('posts the message to its parent room', function() {
        spyOn(room, 'post');
        form.username.value = username;
        form.message.value = message;
        form.submit();
        expect(room.post).toHaveBeenCalledWith(msgMatch);
      });
    });
  });
  
  // Extend HTMLElement
  var Form = Object.create(HTMLElement.prototype);
  
  // Creates the username and message fields.
  Form.createdCallback = function() {
    // Browsers handle forms a bit specially. iOS, for example, puts a Submit
    // button on the keyboard if you're entering data into a form with a
    // submit input.
    //
    // We should be able to get this behavior by extending HTMLFormElement,
    // but that seems likely to break somewhere. Instead, let's just create a
    // normal form tag and put our input elements in it.
    this.innerForm = document.createElement('form');
    this.appendChild(this.innerForm);
  
    this.username = document.createElement('input');
    this.username.setAttribute('type', 'text');
    this.username.setAttribute('class', 'username');
    this.username.setAttribute('placeholder', 'who are you?');
    this.message = document.createElement('input');
    this.message.setAttribute('type', 'text');
    this.message.setAttribute('class', 'message');  
    this.message.setAttribute('placeholder', 'say something');
    var submitter = document.createElement('input');
    submitter.setAttribute('type', 'submit');
    this.innerForm.appendChild(this.username);
    this.innerForm.appendChild(this.message);
    this.innerForm.appendChild(submitter);
  
    this.innerForm.addEventListener('submit', function(event) {
      event.preventDefault();
      this.submit();
    }.bind(this));
  };
  
  // Construct a new message object from the content of the form and
  // submit it to the enclosing <chat-room> with post().
  //
  // Returns the message object.
  Form.submit = function() {
    var msg = {
      ts: Firebase.ServerValue.TIMESTAMP,
      user: this.username.value,
      msg: this.message.value
    };
    this.parentNode.post(msg);
    return msg;
  };
  
  // Register <chat-form>
  return document.registerElement('chat-form', { prototype: Form });
})();
/***** </chat-form> *****/

// We don't need any special behavior for <chat-message>s, so we don't have to
// call registerElement. They'll just be styled with CSS.
//
// That's it!