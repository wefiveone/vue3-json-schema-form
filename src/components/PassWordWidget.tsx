import { defineComponent } from "vue";
import { CommonWidgetPropsDefine, CommonWidgetType } from "../../lib/types";
import { withFormItem } from "../../lib/theme-default/FormItem";

// 自定义组件要符合规范：withFormItem、props
const PasswordWidget: CommonWidgetType = withFormItem(
  defineComponent({
    name: "PassWordWidget",
    props: CommonWidgetPropsDefine,
    setup(props) {
      const handleChange = (e: any) => {
        props.onChange(e.target.value);
      };

      return () => {
        return <input type="password" value={props.value} onInput={handleChange} />;
      };
    },
  })
);

export default PasswordWidget;
