import { computed, defineComponent, provide, ref, watch } from "vue";
import type { PropType, Ref } from "vue";
import Ajv from "ajv";

import type { CommonWidgetType, CustomFormat, Schema, UISchema } from "./types";
import SchemaItem from "./SchemaItem";
import { SchemaFormContextKey } from "./context";
import { ErrorSchema, validateFormData } from "./validator";

const defaultAjvOptions: Ajv.Options = {
  allErrors: true,
};

interface Context {
  doValidate: () => Promise<{ valid: boolean; errors: any[] }>;
}

export default defineComponent({
  name: "SchemaForm",
  props: {
    schema: {
      type: Object as PropType<Schema>,
      required: true,
    },
    value: {
      required: true,
    },
    onChange: {
      type: Function as PropType<(value: any) => void>,
      required: true,
    },
    contextRef: {
      type: Object as PropType<Ref<Context | undefined>>,
    },
    ajvOptions: {
      type: Object as PropType<Ajv.Options>,
    },
    locale: {
      type: String,
      default: "zh",
    },
    customValidate: {
      type: Function as PropType<(data: any, errors: any) => void>,
    },
    uiSchema: {
      type: Object as PropType<UISchema>,
    },
    customFormats: {
      type: [Array, Object] as PropType<CustomFormat | CustomFormat[]>,
    },
    // theme: {
    //   type: Object as PropType<Theme>,
    //   required: true
    // }
  },
  setup(props) {
    // 根据传递进来的options生成validator
    const validatorRef = computed(() => {
      const validator = new Ajv({ ...defaultAjvOptions, ...props.ajvOptions });

      // 添加自定义format
      if (props.customFormats) {
        const customFormats = Array.isArray(props.customFormats)
          ? props.customFormats
          : [props.customFormats];
        customFormats.forEach((format) => {
          validator.addFormat(format.name, format.definition);
        });
      }
      return validator;
    });

    const errorSchemaRef = ref<ErrorSchema>({});

    const validateResolveRef = ref();
    const validateIndex = ref(0);

    // 监听value的变化，校验
    watch(
      () => props.value,
      () => {
        if (validateResolveRef.value) {
          doValidate();
        }
      },
      {
        deep: true,
      }
    );

    const doValidate = async () => {
      const index = ++validateIndex.value;

      const result = await validateFormData(
        validatorRef.value,
        props.value,
        props.schema,
        props.locale,
        props.customValidate
      );

      if (index !== validateIndex.value) return;

      errorSchemaRef.value = result.errorSchema;

      validateResolveRef.value(result);
      validateResolveRef.value = undefined;
    };

    //  保证父组件拿到子组件的doValidate方法
    // watchEffect(() => {
    //   if (props.contextRef && !props.contextRef.value) {
    //     props.contextRef.value = { doValidate }
    //   }
    // })

    if (props.contextRef) {
      props.contextRef.value = {
        doValidate() {
          return new Promise((resolve) => {
            validateResolveRef.value = resolve;
            doValidate();
          });
        },
      };
    }

    const handleChange = (v: any) => {
      props.onChange(v);
    };

    // 将customFormat中组件的format提取成map
    const formatMapRef = computed(() => {
      if (props.customFormats) {
        const customFormats = Array.isArray(props.customFormats) ? props.customFormats : [props.customFormats];
        return customFormats.reduce((result, format) => {
          result[format.name] = format.component
          return result
        }, {} as { [key: string]: CommonWidgetType })
      } else {
        return {}
      }
    })


    const context = {
      SchemaItem,
      formatMapRef
      // theme: props.theme,
    };

    provide(SchemaFormContextKey, context);

    return () => {
      const { schema, value, uiSchema } = props;
      return (
        <SchemaItem
          schema={schema}
          uiSchema={uiSchema || {}}
          value={value}
          onChange={handleChange}
          rootSchema={schema}
          errorSchema={errorSchemaRef.value || {}}
        />
      );
    };
  },
});
