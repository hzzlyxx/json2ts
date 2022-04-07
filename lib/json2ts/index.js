/*
 * @Author: hzzly
 * @Date: 2022-04-02 11:42:34
 * @LastEditTime: 2022-04-05 16:02:03
 * @LastEditors: hzzly
 * @Description: json2ts
 * @FilePath: /json2ts/src/json2ts/index.ts
 */
import { isArray, isObject, isDate, isString, isBoolean, isNumber, isEqual, every, partial, includes, keys, capitalize, lowerFirst } from "lodash-es";
var Json2Ts = /** @class */ (function () {
    function Json2Ts() {
    }
    Json2Ts.prototype.generate = function (content) {
        var jsonContent = '';
        try {
            jsonContent = JSON.parse(content);
        }
        catch (error) {
            throw new Error('There seems to be an error in the JSON');
        }
        if (isArray(jsonContent)) {
            return this.convertObjectToTsInterfaces(jsonContent[0]);
        }
        return this.convertObjectToTsInterfaces(jsonContent);
    };
    Json2Ts.prototype.convertObjectToTsInterfaces = function (jsonContent, objectName) {
        if (objectName === void 0) { objectName = "RootObject"; }
        var optionalKeys = [];
        var objectResult = [];
        for (var key in jsonContent) {
            var value = jsonContent[key];
            if (isObject(value) && !isArray(value)) {
                var childObjectName = this.toUpperFirstLetter(key);
                objectResult.push(this.convertObjectToTsInterfaces(value, childObjectName));
                jsonContent[key] = "".concat(childObjectName, ";");
            }
            else if (isArray(value)) {
                var arrayTypes = this.detectMultiArrayTypes(value);
                if (this.isMultiArray(arrayTypes)) {
                    var multiArrayBrackets = this.getMultiArrayBrackets(value);
                    if (this.isAllEqual(arrayTypes)) {
                        jsonContent[key] = arrayTypes[0].replace("[]", multiArrayBrackets);
                    }
                    else {
                        jsonContent[key] = "any" + multiArrayBrackets + ";";
                    }
                }
                else if (value.length > 0 && isObject(value[0])) {
                    var childObjectName = this.toUpperFirstLetter(key);
                    objectResult.push(this.convertObjectToTsInterfaces(value[0], childObjectName));
                    jsonContent[key] = "".concat(childObjectName, "[];");
                }
                else {
                    jsonContent[key] = arrayTypes[0];
                }
            }
            else if (isDate(value)) {
                jsonContent[key] = "Date;";
            }
            else if (isString(value)) {
                jsonContent[key] = "string;";
            }
            else if (isBoolean(value)) {
                jsonContent[key] = "boolean;";
            }
            else if (isNumber(value)) {
                jsonContent[key] = "number;";
            }
            else {
                jsonContent[key] = "any;";
            }
        }
        var result = this.formatCharsToTypeScript(jsonContent, objectName, optionalKeys);
        objectResult.push(result);
        return objectResult.join("\n\n");
    };
    /**
     * 获取数组类型
     * @param value
     * @param valueType
     * @returns
     */
    Json2Ts.prototype.detectMultiArrayTypes = function (value, valueType) {
        if (valueType === void 0) { valueType = []; }
        if (isArray(value)) {
            if (value.length === 0) {
                valueType.push("any[];");
            }
            else if (isArray(value[0])) {
                // 嵌套数组（只判断第一项）
                for (var index = 0, length_1 = value.length; index < length_1; index++) {
                    var element = value[index];
                    var valueTypeResult = this.detectMultiArrayTypes(element, valueType);
                    valueType.concat(valueTypeResult);
                }
            }
            else if (every(value, isString)) {
                valueType.push("string[];");
            }
            else if (every(value, isNumber)) {
                valueType.push("number[];");
            }
            else if (every(value, isBoolean)) {
                valueType.push("boolean[];");
            }
            else {
                valueType.push("any[];");
            }
        }
        return valueType;
    };
    /**
     * 是否有嵌套多种数组类型
     * eg: [[1, 2, 3], [4, 5, 6]]
     * @param arrayTypes
     * @returns
     */
    Json2Ts.prototype.isMultiArray = function (arrayTypes) {
        return arrayTypes.length > 1;
    };
    Json2Ts.prototype.isAllEqual = function (array) {
        return every(array.slice(1), partial(isEqual, array[0]));
    };
    /**
     * 获取数组括号
     * @param content
     * @returns
     */
    Json2Ts.prototype.getMultiArrayBrackets = function (content) {
        var jsonString = JSON.stringify(content);
        var brackets = "";
        for (var index = 0, length_2 = jsonString.length; index < length_2; index++) {
            var element = jsonString[index];
            if (element === "[") {
                brackets = brackets + "[]";
            }
            else {
                index = length_2;
            }
        }
        return brackets;
    };
    /**
     * 格式化成interface
     * @param jsonContent
     * @param objectName
     * @param optionalKeys
     * @returns
     */
    Json2Ts.prototype.formatCharsToTypeScript = function (jsonContent, objectName, optionalKeys) {
        var result = JSON.stringify(jsonContent, null, "\t")
            .replace(new RegExp("\"", "g"), "")
            .replace(new RegExp(",", "g"), "");
        var allKeys = keys(jsonContent);
        for (var index = 0, length_3 = allKeys.length; index < length_3; index++) {
            var key = allKeys[index];
            if (includes(optionalKeys, key)) {
                result = result.replace(new RegExp(key + ":", "g"), this.toLowerFirstLetter(key) + "?:");
            }
            else {
                result = result.replace(new RegExp(key + ":", "g"), this.toLowerFirstLetter(key) + ":");
            }
        }
        return "export interface " + objectName + " " + result;
    };
    Json2Ts.prototype.toUpperFirstLetter = function (text) {
        return capitalize(text).replace(/\_(\w)/g, function (_, word) {
            return word.toUpperCase();
        });
    };
    ;
    Json2Ts.prototype.toLowerFirstLetter = function (text) {
        return lowerFirst(text);
    };
    ;
    return Json2Ts;
}());
export default function json2ts(code) {
    var instance = new Json2Ts();
    return instance.generate(code);
}
