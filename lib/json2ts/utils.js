// /*
//  * @Author: hzzly
//  * @Date: 2022-04-02 13:57:48
//  * @LastEditTime: 2022-04-02 14:39:39
//  * @LastEditors: hzzly
//  * @Description: 
//  * @FilePath: /json2ts/src/json2ts/utils.ts
//  */
// const supportsArrayBuffer = typeof ArrayBuffer !== 'undefined';
// const supportsDataView = typeof DataView !== 'undefined';
// const ArrayProto = Array.prototype;
// const ObjProto = Object.prototype;
// const nativeIsArray = Array.isArray;
// const nativeKeys = Object.keys;
// const nativeCreate = Object.create;
// const nativeIsView = supportsArrayBuffer && ArrayBuffer.isView;
// const push = ArrayProto.push;
// const slice = ArrayProto.slice;
// const toString = ObjProto.toString;
// const hasOwnProperty = ObjProto.hasOwnProperty;
// // Internal function for creating a `toString`-based type tester.
// export default function tagTester(name: string) {
//   var tag = '[object ' + name + ']';
//   return function (obj: any) {
//     return toString.call(obj) === tag;
//   };
// }
// export const isArray = (arr: any[]) => {
//   // Is a given value an array?
//   // Delegates to ECMA5's native `Array.isArray`.
//   return nativeIsArray(arr) || tagTester('Array')(arr);
// }
// export const isObject = (obj: Record<string, any>) => {
//   const type = typeof obj;
//   return type === 'function' || type === 'object' && !!obj;
// }
// export const isDate = (date: Date) => {
//   return tagTester('Date')(date);
// }
// export const isString = (str: string) => {
//   return tagTester('String')(str);
// }
// export const isBoolean = (obj: boolean) => {
//   return obj === true || obj === false || tagTester('Boolean')(obj);
// }
// export const isNumber = (num: number) => {
//   return tagTester('Number')(num);
// }
// export const isFunction = (fun: Function) => {
//   return tagTester('Function')(fun);
// }
// export const optimizeCb = (func, context, argCount) => {
//   if (context === void 0) return func;
//   switch (argCount == null ? 3 : argCount) {
//     case 1: return function (value) {
//       return func.call(context, value);
//     };
//     case 2: return function (value, other) {
//       return func.call(context, value, other);
//     };
//     case 3: return function (value, index, collection) {
//       return func.call(context, value, index, collection);
//     };
//     case 4: return function (accumulator, value, index, collection) {
//       return func.call(context, accumulator, value, index, collection);
//     };
//   }
//   return function () {
//     return func.apply(context, arguments);
//   };
// };
// export const createAssigner = (keysFunc, undefinedOnly) => {
//   return function (obj) {
//     var length = arguments.length;
//     if (length < 2 || obj == null) return obj;
//     for (var index = 1; index < length; index++) {
//       var source = arguments[index],
//         keys = keysFunc(source),
//         l = keys.length;
//       for (var i = 0; i < l; i++) {
//         var key = keys[i];
//         if (!undefinedOnly || obj[key] === void 0) obj[key] = source[key];
//       }
//     }
//     return obj;
//   };
// };
// export const matcher = (attrs) => {
//   attrs = _.extendOwn({}, attrs);
//   return function (obj) {
//     return _.isMatch(obj, attrs);
//   };
// }
// export const cb = (value, context, argCount) => {
//   // if (_.iteratee !== iteratee) return _.iteratee(value, context);
//   // return baseIteratee(value, context, argCount);
//   if (value == null) return _.identity;
//   if (isFunction(value)) return optimizeCb(value, context, argCount);
//   if (isObject(value)) return _.matcher(value);
//   return _.property(value);
// }
// export const all = (obj, predicate, context) => {
//   predicate = cb(predicate, context);
//   var _keys = !isArrayLike(obj) && keys(obj),
//     length = (_keys || obj).length;
//   for (var index = 0; index < length; index++) {
//     var currentKey = _keys ? _keys[index] : index;
//     if (!predicate(obj[currentKey], currentKey, obj)) return false;
//   }
//   return true;
// };
