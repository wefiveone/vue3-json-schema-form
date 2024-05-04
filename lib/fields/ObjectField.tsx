import { isObject } from "../utils";
import {  useVJSFContext } from "../context";
import { FieldPropsDefine } from "../types";
import { defineComponent } from "vue";

// 定义SchemaItem组件类型,用于inject时赋予类型定义，后面没传props给予更好的提示
// type SchemaItemDefine = DefineComponent<typeof FieldPropsDefine>;
// 抽取出去用CommonFieldType类型替代

export default defineComponent({
  name: "ObjectField",
  props: FieldPropsDefine,
  setup(props) {

    // 解决SchemaItem组件与ObjectField组件的循环引入问题,在根组件SchemaForm中注入SchemaItem组件
    // 抽离hook
    const context = useVJSFContext()

    return () => {
      const { schema, rootSchema, value, errorSchema, uiSchema } = props;

      const { SchemaItem } = context;

      // 获取schema的properties属性
      const properties = schema.properties || {};

      const currentValue: any = isObject(value) ? value : {};

      const handleObjectFieldChange = (key: string, value: any) => {
        const val: any = isObject(props.value) ? props.value : {};

        if (value === undefined) {
          delete val[key];
        } else {
          val[key] = value;
        }

        props.onChange(val);
      };

      return Object.keys(properties).map((key: string, index: number) => {
        return (
          <SchemaItem
            key={index}
            schema={properties[key]}
            uiSchema={uiSchema.properties ? uiSchema.properties[key] || {} : {}}
            rootSchema={rootSchema}
            value={currentValue[key]}
            onChange={(value: any) => handleObjectFieldChange(key, value)}
            errorSchema={errorSchema[key] || {}}
          />
        );
      });
    };
  },
});
