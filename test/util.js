module("util.js");

test('Element.prototype.classList', function () {
  var element = document.createElement('div');
  element.classList.add('test');
  equal('test', element.className);

  element.classList.add('test2');
  element.classList.remove('test');
  equal('test2', element.className);

  ok(!element.classList.contains('test'));
  ok(element.classList.contains('test2'));

  element.classList.toggle('test2');
  ok(!element.classList.contains('test2'));
});

test('glint.util.makeElement', function () {
  var el = glint.util.makeElement('div');

  equals(el.nodeType, 1);
  equals(el.tagName.toLowerCase(), 'div');

  el = glint.util.makeElement('p', {
    'class': 'paragraph',
    'title': 'woot'
  });

  equals(el.className, 'paragraph');
  equals(el.getAttribute('title'), 'woot');
});

test('Function.prototype.bind', function () {
  var fixture = document.querySelector('#qunit-fixture');  
  fixture.classList.remove('red');
  fixture.classList.remove('blue');
  fixture.classList.remove('orange');

  var obj = {
    color: 'blue',
    test: function () {
      fixture.classList.add(this.color);
    },
    test2: function (value) {
      fixture.classList.add(value);
    }
  };
  
  var boundTest = obj.test.bind(obj);
  var boundTest2 = obj.test2.bind(obj, 'orange');
  
  fixture.addEventListener('click', boundTest, false);
  click(fixture);
  
  ok(fixture.classList.contains('blue'));
  
  obj.color = 'red';
  
  click(fixture);
  
  ok(fixture.classList.contains('red'));
  
  fixture.classList.remove('red');
  fixture.classList.remove('blue');        
  
  fixture.removeEventListener('click', boundTest, false);
  
  fixture.addEventListener('click', boundTest2, false);
  click(fixture);
  
  ok(fixture.classList.contains('orange'));
  ok(!fixture.classList.contains('red'));
  ok(!fixture.classList.contains('blue'));
});

test('Function.prototype.bind', function () {
  ok(typeof Function.prototype.bind == 'function');

  var obj = {};

  function fn() {
    return [this, arguments[0], arguments[1]];
  }

  var bound = fn.bind(obj);
  same([obj, undefined, undefined], bound());
  same([obj, 1, undefined], bound(1))
  same([obj, 1, null], bound(1, null));

  bound = fn.bind(obj, 1);
  same([obj, 1, undefined], bound());
  same([obj, 1, 2], bound(2));
});

asyncTest('glint.util.localCoordinates without scroll', function () {
  var localCoordinates = glint.util.localCoordinates;

  var forceScroll = glint.util.makeElement('div');
  forceScroll.style.cssText = 'width: 5000px; height: 5000px; position: absolute; top: 20px; left: 10px;';
  document.body.appendChild(forceScroll);

  forceScroll.addEventListener('click', function (event) {
    var pos = localCoordinates(event);
    equal(0, pos.x);
    equal(0, pos.y);
    start();
    document.body.removeChild(forceScroll);
  }, false);

  click(forceScroll, 10, 20);

});

asyncTest('glint.util.localCoordinates with scroll', function () {
  var localCoordinates = glint.util.localCoordinates;

  var forceScroll = glint.util.makeElement('div');
  forceScroll.style.cssText = 'width: 5000px; height: 5000px; position: absolute; top: 20px; left: 10px;';
  document.body.appendChild(forceScroll);
  window.scrollTo(10, 10);

  // Sanity check
  equal(10, window.pageXOffset, 'pageXOffset correctness');
  equal(10, window.pageYOffset, 'pageYOffset correctness');

  forceScroll.addEventListener('click', function (event) {
    var pos = localCoordinates(event);
    equal(10 / 5000, pos.x);
    equal(10 / 5000, pos.y);
    start();
    document.body.removeChild(forceScroll);
  }, false);

  click(forceScroll, 10, 20);

});