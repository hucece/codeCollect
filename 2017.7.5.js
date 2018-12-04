		//获取数据类型
		var type = function(obj){
			//数据类型
			var classList = {
				"[object Boolean]": "boolean",
				"[object Number]": "number",
				"[object String]": "string",
				"[object Function]": "function",
				"[object Array]": "array",
				"[object Date]": "date",
				"[object RegExp]": "regexp",
				"[object Object]": "object",
				"[object Error]": "error",
				"[object Symbol]": "symbol"
			}
			var _tostring = Object.prototype.toString;
			var type = (typeof obj == "object" || typeof object == "function"?
				classList[_tostring.call(obj)]  || 	typeof obj : typeof obj)
			return type;
		}
		/*递归添加函数到队列中*/
		var addFuncList = function(){
			var list = [];
			var args = arguments;
			(function add(args){
				for(var i=0,length=args.length;i<length;i++){
					var arg = args[i];
					var argType = type(arg);
					if(argType === "function"){
						list.push(arg);
					}else if(arg && arg.length && argType !== "string"){
						add(arg);
					}
				}
			})(args)
			return list;
		};
