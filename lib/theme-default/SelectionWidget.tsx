import { SelectionWidgetPropsDefine } from "../types";
import { defineComponent, ref, watch } from "vue";
import { withFormItem } from "./FormItem";

const SelectionWidget = withFormItem(defineComponent({
  name: 'SelectionWidget',
  props: SelectionWidgetPropsDefine,
  setup(props) {

    const valueRef = ref(props.value)

    watch(valueRef, (newValue, oldValue) => {
      if (oldValue !== newValue) {
        props.onChange(newValue)
      }
    })

    return () => {
      return (
        <select multiple v-model={valueRef.value}>
          {
            props.options.map((op, index) => {  
              const { label, value } = op
              return (
                <option key={index} value={value}>{label}</option>
              )
            })
          }
        </select>
      )
    }
  }  
}))

export default SelectionWidget