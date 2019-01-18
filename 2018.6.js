if (!Function.prototype.bind) {
  Function.prototype.bind = function(oThis) {
    if (typeof this !== 'function') {
      // closest thing possible to the ECMAScript 5
      // internal IsCallable function
      throw new TypeError('Function.prototype.bind - what is trying to be bound is not callable');
    }

    var aArgs   = Array.prototype.slice.call(arguments, 1),
        fToBind = this,
        fNOP    = function() {},
        fBound  = function() {
          return fToBind.apply(this instanceof fNOP
                 ? this
                 : oThis,
                 // 获取调用时(fBound)的传参.bind 返回的函数入参往往是这么传递的
                 aArgs.concat(Array.prototype.slice.call(arguments)));
        };

    // 维护原型关系
    if (this.prototype) {
      // Function.prototype doesn't have a prototype property
      fNOP.prototype = this.prototype; 
    }
    fBound.prototype = new fNOP();

    return fBound;
  };
}

var Type = (function(){
  var type = {};
  var typeList = ['String','Object','Number'];
  for (var i =0, len = typeList.length; i < len; i++) {
    (function(t){
      type['is'+t] = function(obj) {
        return Object.prototype.toString.call(obj) === '[object'+t+']';
      }
    })(typeList[i])
    
  }
  return type;
})()

var mult = (function(){
  var result = {};
  var calculate = function() {
    var value = 1;
    for (var i = 0, len = arguments.length; i<len; i++) {
      value *= arguments[i];
    }
    return value;
  }
  return function() {
    var args = Array.prototype.join.call(arguments, ',');

    if (result[args]) {
      return result[args];
    }

    return result[args] = calculate.apply(null, arguments);

  }
})()

var report = function() {
  var imgList = [];
  return function() {
    var img = new Image();
    imgList.push(img);
    img.src = arguments[0];
  }
}