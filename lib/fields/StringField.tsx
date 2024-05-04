import { computed, defineComponent } from "vue";
import { useGetWidget } from "../theme";
import { CommonWidgetNames, FieldPropsDefine } from "../types";

export default defineComponent({
  name: "StringField",
  props: FieldPropsDefine,
  setup(props) {

    // 获取TextWidget，内置的TextWidget或者自定义的TextWidget
    const TextWidgetRef = computed(() => {
      const widgetRef = useGetWidget(CommonWidgetNames.TextWidget, props)
      return widgetRef.value
    })

    const widgetOptionsRef = computed(() => {
      const { widget, properties, items, ...rest } = props.uiSchema
      return rest 
    })

    const handleChange = (value: string) => {
      props.onChange(value);
    };

    return () => {
      const TextWidget = TextWidgetRef.value;

      return (
        <TextWidget
          value={props.value}
          onChange={handleChange}
          errors={props.errorSchema.__errors}
          schema={props.schema}
          options={widgetOptionsRef.value}
        />
      );
    };
  },
});
