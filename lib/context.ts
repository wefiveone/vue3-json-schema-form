import { Ref, inject } from "vue";
import { Theme, type CommonFieldType, CommonWidgetType } from "./types";

export const SchemaFormContextKey = Symbol();

export function useVJSFContext() {
  // 解决SchemaItem组件与ObjectField组件的循环引入问题,在根组件SchemaForm中注入SchemaItem组件
  const context:
    | {
        SchemaItem: CommonFieldType;
        formatMapRef: Ref<{ [key: string]: CommonWidgetType }>;
      }
    | undefined = inject(SchemaFormContextKey);

  if (!context) {
    throw Error("SchemaForm needed");
  }

  return context;
}
