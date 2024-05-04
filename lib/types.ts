import type { DefineComponent, PropType } from "vue";
import { ErrorSchema } from "./validator";
import { FormatDefinition, KeywordDefinition } from "ajv";

export enum SchemaType {
  "NUMBER" = "number",
  "INTEGER" = "integer",
  "BOOLEAN" = "boolean",
  "STRING" = "string",
  "ARRAY" = "array",
  "OBJECT" = "object",
}

type SchemaRef = { $ref: string };

export interface Schema {
  type: SchemaType | string;
  const?: any;
  format?: string;
  title?: string;
  default?: any;
  properties?: {
    [key: string]: Schema;
  };
  items?: Schema | SchemaRef | Schema[];
  uniqueItems?: any;
  dependencies?: {
    [key: string]: Schema | SchemaRef | string[];
  };
  oneOf?: Schema[];
  anyOf?: Schema[];
  allOf?: Schema[];
  // vjsf?: VueJsonSchemaConfig,
  required?: string[];
  enum?: any[];
  enumNames?: any[];
  enumKeyValue?: any[];
  additionalProperties?: any;
  additionalItems?: Schema;

  minLength?: number;
  maxLength?: number;
  minimun?: number;
  maximum?: number;
  multipleOf?: number;
  exclusiveMaximum?: number;
  exclusiveMinimum?: number;
}

export type UISchema = {
  widget?: string | CommonWidgetType;
  properties?: {
    [key: string]: UISchema
  },
  items?: UISchema | UISchema[]
  [key: string]: any
};

// 每个field的props
export const FieldPropsDefine = {
  schema: {
    type: Object as PropType<Schema>,
    required: true,
  },
  uiSchema: {
    type: Object as PropType<UISchema>,
    required: true,
  },
  value: {
    required: true,
  },
  onChange: {
    type: Function as PropType<(value: any) => void>,
    required: true,
  },
  rootSchema: {
    type: Object as PropType<Schema>,
    required: true,
  },
  errorSchema: {
    type: Object as PropType<ErrorSchema>,
    required: true
  }
} as const;

// 每个field组件的类型
export type CommonFieldType = DefineComponent<typeof FieldPropsDefine>;

// 每个widget的props
export const CommonWidgetPropsDefine = {
  value: {},
  onChange: {
    type: Function as PropType<(value: any) => void>,
    required: true,
  },
  errors: {
    type: Array as PropType<string[]>,
  },
  schema: {
    type: Object as PropType<Schema>,
    required: true,
  },
  // 自定义widget的样式
  options: {
    type: Object as PropType<{ [key: string]: any }>
  }
} as const;

// 每个widget组件的类型
export type CommonWidgetType = DefineComponent<typeof CommonWidgetPropsDefine>;

// SelectionWidget组件的props
export const SelectionWidgetPropsDefine = {
  ...CommonWidgetPropsDefine,
  options: {
    type: Array as PropType<{ label: string; value: any }[]>,
    required: true,
  },
} as const
// SelectionWidget组件的类型
export type SelectionWidgetType = DefineComponent<
  typeof SelectionWidgetPropsDefine
>;

export enum SelectionWidgetNames {
  SelectionWidget = "SelectionWidget",
}

export enum CommonWidgetNames {
  TextWidget = "TextWidget",
  NumberWidget = "NumberWidget",
}

export interface Theme {
  widgets: {
    [SelectionWidgetNames.SelectionWidget]: SelectionWidgetType;
    [CommonWidgetNames.TextWidget]: CommonWidgetType;
    [CommonWidgetNames.NumberWidget]: CommonWidgetType;
  };
}

export interface CustomFormat {
  name: string
  definition: FormatDefinition
  component: CommonWidgetType
}

export interface CustomKeyword {
  name: string
  definition: KeywordDefinition
  
}