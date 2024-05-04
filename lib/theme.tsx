import { CommonWidgetNames, CommonWidgetType, FieldPropsDefine, SelectionWidgetNames, UISchema } from "./types";
import { Theme } from "./types";
import {
  ComputedRef,
  ExtractPropTypes,
  Fragment,
  PropType,
  computed,
  defineComponent,
  inject,
  provide,
  ref,
} from "vue";
import { isObject } from "./utils";
import { useVJSFContext } from "./context";

const THEME_PROVIDER_KEY = Symbol();

const ThemeProvider = defineComponent({
  name: "ThemeProvider",
  props: {
    theme: {
      type: Object as PropType<Theme>,
      required: true,
    },
  },
  setup(props, { slots }) {
    // 定义一个响应式的context向下传递，保持主题的响应式
    const context = computed(() => props.theme);

    provide(THEME_PROVIDER_KEY, context);

    return () => {
      return slots.default && slots.default();
    };
  },
});

export const useGetWidget = <
  T extends SelectionWidgetNames | CommonWidgetNames
>(
  name: T,
  props?: ExtractPropTypes<typeof FieldPropsDefine>
) => {

  const formContext = useVJSFContext()

  if (props) {
    const { uiSchema, schema } = props;
    if (uiSchema?.widget && isObject(uiSchema.widget)) {
      return ref(uiSchema.widget as CommonWidgetType)
    }
    // 如果选择了自定义的format字段
    if (schema.format) {
      if(formContext.formatMapRef.value[schema.format]) {
        return ref(formContext.formatMapRef.value[schema.format])
      }
    }
  }


  const context = inject<ComputedRef<Theme>>(THEME_PROVIDER_KEY);

  if (!context) {
    throw new Error("vjsf theme required");
  }

  const widgetRef = computed(() => context.value.widgets[name]);

  return widgetRef;
};

export default ThemeProvider;
