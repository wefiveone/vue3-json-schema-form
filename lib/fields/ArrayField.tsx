import { createUseStyles } from "vue-jss";
import { useVJSFContext } from "../context";
import { FieldPropsDefine, Schema } from "../types";
import { PropType, computed, defineComponent } from "vue";
import { useGetWidget } from "../theme";
import { SelectionWidgetNames } from "../types";
// import Selection from "../widget/Selection";

/**
 * {
 *  items: { type: "string" },
 * }
 *
 * {
 *  items: [
 *    { type: "string" },
 *    { type: 'number }
 *  ]
 * }
 *
 * {
 *  items: {
 *    type: "string",
 *    enum: ['1', '2']
 *  }
 * }
 *
 */

const useStyles = createUseStyles({
  container: {
    border: "1px solid #eee",
  },
  action: {
    background: "#eee",
    padding: "10px",
    textAlign: "right",
  },
  btn: {
    "& + &": {
      marginLeft: "10px",
    },
  },
  content: {
    padding: "10px",
  },
});

// items为SingleType时，value数组没有限制长度,所以添加按钮来控制数组长度
const ArrayItemWrapper = defineComponent({
  name: "ArrayItemWrapper",
  props: {
    onAdd: {
      type: Function as PropType<(index: number) => void>,
      required: true,
    },
    onDelete: {
      type: Function as PropType<(index: number) => void>,
      required: true,
    },
    onUp: {
      type: Function as PropType<(index: number) => void>,
      required: true,
    },
    onDown: {
      type: Function as PropType<(index: number) => void>,
      required: true,
    },
    index: {
      type: Number,
      required: true,
    },
  },
  setup(props, { slots }) {
    const classesRef = useStyles();

    return () => {
      const classes = classesRef.value;
      const { onAdd, onDelete, onDown, onUp, index } = props;
      return (
        <div class={classes.container}>
          <div class={classes.action}>
            <button class={classes.btn} onClick={() => onAdd(index)}>
              新增
            </button>
            <button class={classes.btn} onClick={() => onDelete(index)}>
              删除
            </button>
            <button class={classes.btn} onClick={() => onUp(index)}>
              上移
            </button>
            <button class={classes.btn} onClick={() => onDown(index)}>
              下移
            </button>
          </div>
          <div class={classes.content}>{slots.default && slots.default()}</div>
        </div>
      );
    };
  },
});

export default defineComponent({
  name: "ArrayField",
  props: FieldPropsDefine,
  setup(props) {
    const context = useVJSFContext();

    const handleArrayItemChange = (v: any, index: number) => {
      const { value } = props;
      const arr = Array.isArray(value) ? value : [];
      arr[index] = v;

      props.onChange(arr);
    };

    const handleAdd = (index: number) => {
      const { value } = props;
      const arr = Array.isArray(value) ? value : [];

      arr.splice(index + 1, 0, undefined);

      props.onChange(arr);
    };
    const handleDelete = (index: number) => {
      const { value } = props;
      const arr = Array.isArray(value) ? value : [];

      arr.splice(index, 1);

      props.onChange(arr);
    };
    const handleUp = (index: number) => {
      // 如果是第一个元素，则不处理
      if (index === 0) return;

      const { value } = props;
      const arr = Array.isArray(value) ? value : [];

      // 删除并拿到当前元素
      const [item] = arr.splice(index, 1);
      // 插入到原来当前元素的前一个元素前面
      arr.splice(index - 1, 0, item);

      props.onChange(arr);
    };
    const handleDown = (index: number) => {
      const { value } = props;
      const arr = Array.isArray(value) ? value : [];

      // 如果是最后一个元素，则不处理
      if (index === arr.length - 1) return;

      // 删除并拿到当前元素
      const [item] = arr.splice(index, 1);
      // 插入到原来当前元素的下一个元素后面
      arr.splice(index + 1, 0, item);

      props.onChange(arr);
    };

    const SelectionWidgetRef = computed(() => {
      const widgetRef = useGetWidget(SelectionWidgetNames.SelectionWidget, props)
      return widgetRef.value
    })

    return () => {
      const { SchemaItem } = context;
      const Selection = SelectionWidgetRef.value;

      const { schema, rootSchema, value, errorSchema, onChange, uiSchema } = props;

      const isMultiType = Array.isArray(schema.items);
      const isSelect = schema.items && (schema.items as any).enum;

      if (isMultiType) {
        const items: Schema[] = schema.items as any;
        const arr = Array.isArray(value) ? value : [];
        return items.map((schema, index) => {
          return (
            <SchemaItem
              key={index}
              schema={schema}
              uiSchema={uiSchema.items ? (uiSchema.items as any)[index] || {} : {}}
              rootSchema={rootSchema}
              value={arr[index]}
              onChange={(v: any) => handleArrayItemChange(v, index)}
              errorSchema={errorSchema[index] || {}}
            />
          );
        });
      } else if (!isSelect) {
        const arr = Array.isArray(value) ? value : [];
        return arr.map((value: any, index: number) => {
          return (
            <ArrayItemWrapper
              key={index}
              onAdd={handleAdd}
              onDelete={handleDelete}
              onUp={handleUp}
              onDown={handleDown}
              index={index}
            >
              <SchemaItem
                schema={schema.items as Schema}
                uiSchema={ uiSchema.items as any || {} }
                rootSchema={rootSchema}
                value={value}
                onChange={(v: any) => handleArrayItemChange(v, index)}
                errorSchema={errorSchema[index] || {}}
              />
            </ArrayItemWrapper>
          );
        });
      } else {
        const enumOptions = (schema.items as any).enum;
        const options = enumOptions.map((item: any) => {
          return { label: item, value: item };
        });
        return (
          <Selection
            onChange={onChange}
            value={value}
            options={options}
            errors={errorSchema.__errors}
            schema={schema}
          />
        );
      }
    };
  },
});
