"use strict";

describe('a <chat-form>', function() {
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
  
  describe('has a submit function', function() {
    var username = 'audre';
    var message = 'I do not dwell';
    var msgMatch = jasmine.objectContaining({
      user: username,
      msg: message,
    });

    it('which returns a message object', function() {
      form.querySelector('input.username').value = username;
      form.querySelector('input.message').value = message;
      var msg = form.submit();
      expect(msg).toEqual(msgMatch);
    });

    it('which calls post(message) on its parent room', function() {
      spyOn(room, 'post');
      form.querySelector('input.username').value = username;
      form.querySelector('input.message').value = message;
      form.submit();
      expect(room.post).toHaveBeenCalledWith(msgMatch);
    });
  });
});