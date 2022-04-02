declare class Json2Ts {
    convert(content: string): string;
    private convertObjectToTsInterfaces;
    private detectMultiArrayTypes;
    private isMultiArray;
    private isAllEqual;
    private getMultiArrayBrackets;
    private formatCharsToTypeScript;
    private removeMajority;
    private toUpperFirstLetter;
    private toLowerFirstLetter;
    isJson(stringContent: string): boolean;
}
export default Json2Ts;
