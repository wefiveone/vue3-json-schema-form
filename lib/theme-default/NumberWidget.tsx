import { CommonWidgetPropsDefine, CommonWidgetType } from "../types";
import { defineComponent } from "vue";
import { withFormItem } from "./FormItem";

const NumberWidget:CommonWidgetType = withFormItem(defineComponent({
  name: "NumberWidget",
  props: CommonWidgetPropsDefine,
  setup(props) {

    const handleChange = (e: any) => {
      const value = e.target.value;

      // 转换为数字类型
      const num = Number(value);

      if (Number.isNaN(num)) {
        props.onChange(undefined);
      } else {
        props.onChange(num);
      }
    };

    return () => {
      return (
        <input type="number" value={props.value} onChange={handleChange}  />
      )
    }
  }
}))

export default NumberWidget