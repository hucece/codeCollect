/*深度克隆*/
function deepClone(obj){
	var objType = type(obj);   //2017.7.5.js

	if(objType === "object"){
		var result = {};
		for(var key in obj){
			result[key] = deepClone(obj[key]);
		}
		return result
	}else if(objType === "array"){
		var result = [];
		for(var i = 0; i<obj.length; i++){
			result[i] = deepClone(obj[i]);
		}
		return result;
	}else{
		return obj;
	}
}
/*获取数组中的最大值和最小值*/
function max(arr){
	return Math.max.apply(null,arr);
}
function min(arr){
	return Math.min.apply(null,arr);
}


/*************************************数组去重的几种方法**********************************/
function uniqueByIndexof(arr){
	var result = [],i = 0,length = arr.length;
	for(;i<length;i++){
		if(result.indexOf(arr[i]) === -1){
			result.push(arr[i]);
		}
	}
	return result;
}
function uniqueByType(arr){
	var temp = {}, result = [];
	var i = 0,length = arr.length;
	var itemType;
	for(;i<length;i++){
		itemType = type(arr[i]) + arr[i];
		if(!temp[itemType]){
			temp[itemType] = 1;
			result.push(arr[i]);
		}
	}
	return result;
}
function uniqueBySet(arr){
	var s = new Set(arr);    //es6
	return Array.from(s);
}
function uniqueBySort(arr){   //NaN不能判断
	arr.sort();
	var newArr = [arr[0]],i=1,length = arr.length;
	for(;i<length;i++){
		var lastNum = newArr.length -1;
		if(arr[i] !== newArr[lastNum]){
			newArr.push(arr[i]);
		}
	}
	return newArr;
}