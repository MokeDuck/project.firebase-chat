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
describe('a <chat-room>', function() {
  it('can be created with document.createElement or new Chat.Room()', function() {
    expect(document.createElement('chat-room').constructor)
    .toBe(Chat.Room);
  });

  var room;
  beforeEach(function() {
    room = new Chat.Room();
  });

  it('always has a <chat-log>', function() {
    expect(room.querySelector('chat-log')).not.toBeNull();
    expect(room.querySelector('chat-log')).toBe(room.log);
  });

  it('always has a <chat-form>', function() {
    expect(room.querySelector('chat-form')).not.toBeNull();
    expect(room.querySelector('chat-form')).toBe(room.form);
  });

  describe('connects to Firebase', function() {
    beforeAll(function() {
      // MockFirebase is an implementation of Firebase that just stores data
      // in Javascript objects. It's totally non-persistent storage with the
      // same interface as our real database--great for testing!
      // MockFirebase.override() replace window.Firebase with MockFirebase,
      // so we can run tests without hitting an actual firebase and filling
      // it with test data.
      MockFirebase.override();
    });

    it('when you call connect(url) on it', function() {
      room.connect('http://example.firebase');
      expect(room.db).toEqual(jasmine.objectContaining({
        child: jasmine.any(Function),
      }));
    });    

  	it('when you set its db attribute', function() {
      room.setAttribute('db', 'http://example.firebase');
      expect(room.db).toEqual(jasmine.objectContaining({
        child: jasmine.any(Function),
      }));
    });

    afterAll(function() {
      // Restore normal Firebase functionality.
      MockFirebase.restore();
    });    
  });

  describe("-- once it's connected to Firebase --", function() {
    beforeAll(function() { MockFirebase.override(); });

    var msg = {ts: 10000, user: 'audre', msg: 'I do not dwell'};
    beforeEach(function() {
      room.connect('http://example.firebase');
    });

    it("appends messages to its log when they're pushed to db/messages", function() {
      spyOn(room.log, 'append');
      // simulate another client pushing a message to the db.
      room.db.child('messages').push(msg);
      // flush is a MockFirebase function that dispatches all pending
      // Firebase events. Normally they would trigger asynchronously, when
      // data arrived from the server.
      room.db.flush();
      expect(room.log.append).toHaveBeenCalledWith(msg);
    });

    it('will push message objects into Firebase when you call post()', function() {
      room.post(msg);
      room.post(msg);
      room.post(msg);
      room.db.flush();
      var children = room.db.child('messages').getData();
      expect(Object.keys(children).length).toBe(3);
    });

    afterAll(function() { MockFirebase.restore(); });
  });
});
