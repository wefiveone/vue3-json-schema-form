import { withFormItem } from "../../lib/theme-default/FormItem";
import { CommonWidgetPropsDefine, CustomFormat } from "../../lib/types";
import { defineComponent, computed } from "vue";

const format: CustomFormat = {
  name: 'color',
  definition: {
    type: 'string',
    validate: /^#[0-9A-Fa-f]{6}$/
  },
  component: withFormItem(defineComponent({
    name: 'colorWidget',
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
          <input type="color" value={props.value} onChange={handleChange} style={styleRef.value} />
        )
      }
    }
  }))
}

export default format