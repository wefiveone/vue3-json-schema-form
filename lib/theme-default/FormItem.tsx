import { CommonFieldType, CommonWidgetPropsDefine, CommonWidgetType } from '../types'
import { defineComponent } from 'vue'

import { createUseStyles } from 'vue-jss'

const useStyles = createUseStyles({
  label: {
    display: 'block',
    color: '#777'
  },
  errorText: {
    color: 'red',
    fontSize: '12px',
    margin: '5px 0px',
    paddingLeft: '20px',
  }
})

const FormItem = defineComponent({
  name: 'FormItem',
  props: CommonWidgetPropsDefine,
  setup(props, { slots }) {

    const classesRef = useStyles() 

    return () => {
      const { schema, errors } = props

      const classes = classesRef.value
      
      
      return (
        <div>
          <label class={classes.label}>{schema.title}</label>
          { slots.default && slots.default() }
          <ul class={classes.errorText}>
            {
              errors?.map((err) => {
                return (
                  <li>{err}</li>
                )
              })
            }
          </ul>
        </div>
      )
    }
  }
})

export default FormItem

export function withFormItem(Widget: any) {
  return defineComponent({
    name: `Wrapped${Widget.name}`,
    props: CommonWidgetPropsDefine,
    setup(props, { attrs }) {
      return () => {
        return (
          <FormItem {...props}>
            <Widget {...props} {...attrs} />
          </FormItem>
        )
      }
    }
  }) as any
}