## @hzzlyxx/json2ts

![NPM version](https://img.shields.io/npm/v/@hzzlyxx/json2ts)
![NPM download](https://img.shields.io/npm/dt/@hzzlyxx/json2ts)

### How to use

```
npm install @hzzlyxx/json2ts --save
// or
yarn add @hzzlyxx/json2ts
```

### Examples

```ts
import { json2ts } from '@hzzlyxx/json2ts';

const json = {
  Button: {
    description: '按钮组件',
    props: [
      {
        name: 'htmlType',
        type: '"button" | "submit" | "reset"',
        default: '',
        description: 'Button 类型',
        required: false,
      },
    ],
  },
};
const ts = json2ts(json);

// ts
export interface Props {
  name: string;
  type: string;
  default: string;
  description: string;
  required: boolean;
}

export interface Button {
  description: string;
  props: Props[];
}

export interface RootObject {
  button: Button;
}
```
