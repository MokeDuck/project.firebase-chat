"use strict";

var Chat = Chat || {};

Chat.Log = (function() { 
  // Log extends HTMLElement.
  var Log = Object.create(HTMLElement.prototype);
  
  // Takes a message, creates a new <chat-message> element, appends it to
  // the chat log and scrolls the log to the bottom.
  //
  // Example message element: <chat-message user="audre" timestamp="123455677">Hi.</chat-message>
  //
  // Returns the created <chat-message>.
  // Message is a chat room message object (see README.md for the structure).
  Log.append = function(message) {
    // TODO: make a DOM element to hold the message with document.createElement.
    //       (The styles are already in place for 'chat-message' elements, so you
    //       probably want to make one of those).
    // TODO: add attributes for the timestamp and user.
    // TODO: append a message element to the log
  };
  
  return document.registerElement('chat-log', { prototype: Log });
})();
