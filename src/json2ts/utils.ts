/*
 * @Author: hzzly
 * @Date: 2022-04-02 13:57:48
 * @LastEditTime: 2022-04-02 14:39:39
 * @LastEditors: hzzly
 * @Description:
 * @FilePath: /json2ts/src/json2ts/utils.ts
 */
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
