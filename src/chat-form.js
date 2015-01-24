"use strict";

var Chat = Chat || {};

Chat.Form = (function() {
  // Form extends HTMLElement
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
  
    // TODO: create these elements:
    // TODO:   <input class="username" type="text">
    // TODO:   <input class="message" type="text">
    // TODO: save them in this.username and this.message, respectively.

    this.innerForm.appendChild(this.username);
    this.innerForm.appendChild(this.message);

    var submitter = document.createElement('input');
    submitter.setAttribute('type', 'submit');
    this.innerForm.appendChild(submitter);
  
    this.innerForm.addEventListener('submit', function(event) {
      event.preventDefault();
      this.submit();
    }.bind(this));
  };
  
  // Construct a new message object from the content of the form and
  // submit it to the enclosing chat room element with post().
  // 
  // The structure of the message object is described in README.md.
  //
  // Returns the created message object.
  Form.submit = function() {
    // TODO: construct a message according to the format in README.md
    // TODO: call post with that message on our parentNode (a chat room).
  };
  
  return document.registerElement('chat-form', { prototype: Form });
})();
