import { computed, defineComponent } from "vue";
import { CommonWidgetPropsDefine, CommonWidgetType } from "../types";
import { withFormItem } from "./FormItem";

const TextWidget: CommonWidgetType = withFormItem(
  defineComponent({
    name: "TextWidget",
    props: CommonWidgetPropsDefine,
    setup(props) {
      const handleChange = (e: any) => {
        props.onChange(e.target.value);
      };

      const styleRef = computed(() => {
        return {
          color: props.options?.color || "black",
        };
      });

      return () => {
        return (
          <input type="text" value={props.value} onInput={handleChange} style={styleRef.value} />
        );
      };
    },
  })
);

export default TextWidget;
