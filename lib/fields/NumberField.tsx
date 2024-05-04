import { useGetWidget } from "../theme";
import { CommonWidgetNames, FieldPropsDefine } from "../types";
import { defineComponent, computed } from "vue";

export default defineComponent({
  name: "NumberField",
  props: FieldPropsDefine,
  setup(props) {
    const NumberWidgetRef = computed(() => {
      const widgetRef = useGetWidget(CommonWidgetNames.NumberWidget, props)
      return widgetRef.value
    })

    return () => {
      const NumberWidget = NumberWidgetRef.value;

      const handleChange = (value: number) => {
        props.onChange(value);
      };

      return (
        <NumberWidget
          value={props.value}
          onChange={handleChange}
          errors={props.errorSchema.__errors}
          schema={props.schema}
        />
      );
    };
  },
});
