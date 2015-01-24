"use strict";  // http://speakingjs.com/es5/ch07.html#strict_mode

// We'll store all our stuff in an object named Chat.
// Create it if it doesn't exist.
var Chat = Chat || {};

// Chat.Room is a Javascript module.
//
// What's happening is: we're putting our module code inside a
// function literal, which we then immediately call at the bottom of the
// module. The function returns whatever we want to export from the module.
// This lets us use whatever variable names we want within the module without
// sullying the window namespace.
Chat.Room = (function() {
  // Object.create creates a new object with the specified prototype. In this
  // case, we're creating a new object with HTMLElement as its prototype.
  //
  // This says: "Room extends HTMLElement"
  var Room = Object.create(HTMLElement.prototype);
  
  // createdCallback is called by the browser when a new <chat-room>
  // is created or found in the document.
  Room.createdCallback = function() {
    // TODO: create new chat-log and chat-form elements with document.createElement
    // TODO: append them to this chat room.
    if (this.hasAttribute('db')) {
      this.connect(this.getAttribute('db'));
    }
  };
  
  // Create a new Firebase ref for url and store it in this.db.
  Room.connect = function(url) {
    // TODO: create a new Firebase ref pointing to URL.
    // TODO: store that firebase ref in this.db.
    // TODO: listen for the 'child_added' event on db.child('messages')
    //       and append a message to the log when it fires.
  };

  // Send a message to the server.
  // Message is a chat room protocol message (see README.md).
  Room.post = function(message) {
    // TODO: push message to the 'messages' child of this.db
  };
  
  // Called when an attribute value is changed.
  Room.attributeChangedCallback = function(attr, oldVal, newVal) {
    switch(attr) {
    case 'db':
      this.connect(newVal);
    }
  };

  // Register our element. All <chat-room> tags will now use our prototype.
  // document.registerElement returns a constructor function for <chat-room>
  // elements.
  return document.registerElement('chat-room', { prototype: Room });
})();