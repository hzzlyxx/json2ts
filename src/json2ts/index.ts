/*
 * @Author: hzzly
 * @Date: 2022-04-02 11:42:34
 * @LastEditTime: 2022-04-02 15:17:55
 * @LastEditors: hzzly
 * @Description: json2ts
 * @FilePath: /json2ts/src/json2ts/index.ts
 */
import { isArray, isObject, isDate, isString, isBoolean, isNumber, isEqual, every, partial, includes, keys } from "lodash-es";

class Json2Ts {
  convert(content: string): string {
    let jsonContent = '';

    try {
      jsonContent = JSON.parse(content)
    } catch (error) {
      throw new Error(error);
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
        jsonContent[key] = this.removeMajority(childObjectName) + ";";
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
          jsonContent[key] = this.removeMajority(childObjectName) + "[];";
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
        optionalKeys.push(key);
      }
    }

    let result = this.formatCharsToTypeScript(jsonContent, objectName, optionalKeys);
    objectResult.push(result);

    return objectResult.join("\n\n");
  }

  private detectMultiArrayTypes(value: any, valueType: string[] = []): string[] {
    if (isArray(value)) {
      if (value.length === 0) {
        valueType.push("any[];");
      } else if (isArray(value[0])) {
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

  private isMultiArray(arrayTypes: string[]) {
    return arrayTypes.length > 1;
  }

  private isAllEqual(array: string[]) {
    return every(array.slice(1), partial(isEqual, array[0]));
  }

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

    objectName = this.removeMajority(objectName);

    return "export interface " + objectName + " " + result;
  }

  private removeMajority(objectName: string): string {
    console.log(objectName)
    // if (last(objectName, 3).join("").toUpperCase() === "IES") {
    //   return objectName.substring(0, objectName.length - 3) + "y";
    // } else if (last(objectName).toUpperCase() === "S") {
    //   return objectName.substring(0, objectName.length - 1);
    // }

    return objectName;
  }

  private toUpperFirstLetter(text: string) {
    return text.charAt(0).toUpperCase() + text.slice(1);
  };

  private toLowerFirstLetter(text: string) {
    return text.charAt(0).toLowerCase() + text.slice(1);
  };

  isJson(stringContent: string): boolean {
    try {
      JSON.parse(stringContent);
    } catch (e) {
      return false;
    }
    return true;
  }
}

export default Json2Ts;