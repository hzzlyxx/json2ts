/*
 * @Author: hzzly
 * @Date: 2022-04-02 11:42:34
 * @LastEditTime: 2022-04-02 17:41:38
 * @LastEditors: hzzly
 * @Description: json2ts
 * @FilePath: /json2ts/src/index.ts
 */
import { isArray, isObject, isDate, isString, isBoolean, isNumber, isEqual, every, partial, includes, keys, capitalize, lowerFirst } from "lodash-es";

class Json2Ts {
  generate(content: string): string {
    let jsonContent = '';

    try {
      jsonContent = JSON.parse(content)
    } catch (error) {
      throw new Error('There seems to be an error in the JSON');
    }

    if (isArray(jsonContent)) {
      return this.convertObjectToTsInterfaces(jsonContent[0]);
    }

    return this.convertObjectToTsInterfaces(jsonContent);
  }

  private convertObjectToTsInterfaces(jsonContent: any, objectName: string = "RootObject"): string {
    let optionalKeys: string[] = [];
    let objectResult: string[] = [];

    for (let key in jsonContent) {
      let value = jsonContent[key];

      if (isObject(value) && !isArray(value)) {
        let childObjectName = this.toUpperFirstLetter(key);
        objectResult.push(this.convertObjectToTsInterfaces(value, childObjectName));
        jsonContent[key] = `${childObjectName};`;
      } else if (isArray(value)) {
        let arrayTypes: any = this.detectMultiArrayTypes(value);

        if (this.isMultiArray(arrayTypes)) {
          let multiArrayBrackets = this.getMultiArrayBrackets(value);

          if (this.isAllEqual(arrayTypes)) {
            jsonContent[key] = arrayTypes[0].replace("[]", multiArrayBrackets);
          } else {
            jsonContent[key] = "any" + multiArrayBrackets + ";";
          }
        } else if (value.length > 0 && isObject(value[0])) {
          let childObjectName = this.toUpperFirstLetter(key);
          objectResult.push(this.convertObjectToTsInterfaces(value[0], childObjectName));
          jsonContent[key] = `${childObjectName}[];`;
        } else {
          jsonContent[key] = arrayTypes[0];
        }

      } else if (isDate(value)) {
        jsonContent[key] = "Date;";
      } else if (isString(value)) {
        jsonContent[key] = "string;";
      } else if (isBoolean(value)) {
        jsonContent[key] = "boolean;";
      } else if (isNumber(value)) {
        jsonContent[key] = "number;";
      } else {
        jsonContent[key] = "any;";
      }
    }

    let result = this.formatCharsToTypeScript(jsonContent, objectName, optionalKeys);
    objectResult.push(result);

    return objectResult.join("\n\n");
  }

  /**
   * 获取数组类型
   * @param value 
   * @param valueType 
   * @returns 
   */
  private detectMultiArrayTypes(value: any, valueType: string[] = []): string[] {
    if (isArray(value)) {
      if (value.length === 0) {
        valueType.push("any[];");
      } else if (isArray(value[0])) {
        // 嵌套数组（只判断第一项）
        for (let index = 0, length = value.length; index < length; index++) {
          let element = value[index];

          let valueTypeResult = this.detectMultiArrayTypes(element, valueType);
          valueType.concat(valueTypeResult);
        }
      } else if (every(value, isString)) {
        valueType.push("string[];");
      } else if (every(value, isNumber)) {
        valueType.push("number[];");
      } else if (every(value, isBoolean)) {
        valueType.push("boolean[];");
      } else {
        valueType.push("any[];");
      }
    }

    return valueType;
  }

  /**
   * 是否有嵌套多种数组类型
   * eg: [[1, 2, 3], [4, 5, 6]]
   * @param arrayTypes 
   * @returns 
   */
  private isMultiArray(arrayTypes: string[]) {
    return arrayTypes.length > 1;
  }

  private isAllEqual(array: string[]) {
    return every(array.slice(1), partial(isEqual, array[0]));
  }

  /**
   * 获取数组括号
   * @param content 
   * @returns 
   */
  private getMultiArrayBrackets(content: any[]): string {
    let jsonString = JSON.stringify(content);
    let brackets = "";

    for (let index = 0, length = jsonString.length; index < length; index++) {
      let element = jsonString[index];

      if (element === "[") {
        brackets = brackets + "[]";
      } else {
        index = length;
      }
    }

    return brackets;
  }

  /**
   * 格式化成interface
   * @param jsonContent 
   * @param objectName 
   * @param optionalKeys 
   * @returns 
   */
  private formatCharsToTypeScript(jsonContent: any, objectName: string, optionalKeys: string[]): string {
    let result = JSON.stringify(jsonContent, null, "\t")
      .replace(new RegExp("\"", "g"), "")
      .replace(new RegExp(",", "g"), "");

    let allKeys = keys(jsonContent);
    for (let index = 0, length = allKeys.length; index < length; index++) {
      let key = allKeys[index];
      if (includes(optionalKeys, key)) {
        result = result.replace(new RegExp(key + ":", "g"), this.toLowerFirstLetter(key) + "?:");
      } else {
        result = result.replace(new RegExp(key + ":", "g"), this.toLowerFirstLetter(key) + ":");
      }
    }

    return "export interface " + objectName + " " + result;
  }

  private toUpperFirstLetter(text: string) {
    return capitalize(text).replace(/\_(\w)/g, (_, word) => {
      return word.toUpperCase();
    });
  };

  private toLowerFirstLetter(text: string) {
    return lowerFirst(text);
  };
}

export default function json2ts(code: string) {
  const instance = new Json2Ts();
  return instance.generate(code);
}

// @ts-ignore
window.json2ts = json2ts;
