import { computed, defineComponent } from "vue";
import { StringField } from ".";
import { NumberField } from ".";
import { ObjectField } from ".";
import { ArrayField  }from ".";
import { retrieveSchema } from "./utils";
import { FieldPropsDefine, SchemaType } from "./types";

export default defineComponent({
  name: 'SchemaItem',
  props: FieldPropsDefine,
  setup(props) {

    const retrievedSchemaRef = computed(() => {
      const { schema, value, rootSchema  } = props
      return retrieveSchema(schema, rootSchema, value)
    })

    return () => {
      const { schema } = props
      const { type } = schema

      const retrievedSchema = retrievedSchemaRef.value

      let Component: any

      switch (type) {
        case SchemaType.STRING:
          Component = StringField
          break
        case SchemaType.NUMBER:
          Component = NumberField
          break
        case SchemaType.OBJECT:
          Component = ObjectField
          break
        case SchemaType.ARRAY:
          Component = ArrayField
          break
        default:
          console.warn(`${type} is not supported`)
      }

      return <Component {...props} schema={retrievedSchema} />
    }
  }
})