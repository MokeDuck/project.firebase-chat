"use strict";

describe('a <chat-log>', function() {
  var log;
  beforeEach(function() { log = new Chat.Log(); })  

  describe('has an append function', function() {
    it('which returns a <chat-message> node with attributes and content', function() {
      var msg = {ts: 10, user: 'audre', msg: 'I do not dwell'};
      var node = log.append(msg);
      expectNodeShowsMessage(node, msg);
    });

    it('which appends the <chat-message> to the room', function() {
      var msg = log.append({ts: 10, user: 'audre', msg: 'I do not dwell'});
      expect(log.contains(msg)).toBe(true);
    });
  });

  // Spec helper function. Takes a node and a message and expects that the node
  // is a <chat-message> with the relevant data contained in the message.
  var expectNodeShowsMessage = function(node, msg) {
    expect(node).toEqual(jasmine.objectContaining({
      attributes: {
        timestamp: { value: msg.ts },
        user: { value: msg.user }
      },
      textContent: msg.msg
    }));
  };
});

