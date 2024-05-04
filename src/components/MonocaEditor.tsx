import { defineComponent, onBeforeMount, onMounted, ref, shallowRef, watch } from "vue";
import type { PropType } from 'vue'
import { createUseStyles } from "vue-jss";
import * as Monaco from "monaco-editor";

const useStyles = createUseStyles({
  container: {
    display: "flex",
    flexDirection: "column",
    border: "1px solid #eee",
    borderRadius: 5,
  },
  title: {
    backgroundColor: "#eee",
    padding: '10px 0',
    paddingLeft: 20,
  },
  code: {
    flexGrow: 1
  }
});

export default defineComponent({
  name: 'MonocaEditor',
  props: {
    code: {
      type: String as PropType<string>
    },
    onchange: {
      type: Function as PropType<(value: string, event: Monaco.editor.IModelContentChangedEvent) => void>,
      required: true
    },
    title: {
      type: String as PropType<string>,
      required: true
    }
  },
  setup(props) {

    const editorRef = shallowRef()

    const containerRef = ref()

    let _subscription: Monaco.IDisposable | undefined
    let _prevent_trigger_change_event = false

    onMounted(() => {
      const editor = editorRef.value = Monaco.editor.create(containerRef.value, {
        value: props.code,
        language: "json",
        tabSize: 2,
        minimap: {
          enabled: false
        }
      })

      _subscription = editor.onDidChangeModelContent((event) => {
        if (_prevent_trigger_change_event) return;
        props.onchange(editor.getValue(), event);
      });
    })

    onBeforeMount(() => {
      if (_subscription) _subscription.dispose()
    })

    watch(() => props.code, (v) => {
      const editor = editorRef.value
      const model = editor.getModel()
      if (v !== model.getValue()) {
        editor.pushUndoStop();
        _prevent_trigger_change_event = true;

        model.pushEditOperations(
          [],
          [
            {
              range: model.getFullModelRange(),
              text: v
            }
          ]
        )
      }
    })

    const classesRef = useStyles()

    return () => {

      const classes = classesRef.value

      return (
        <div class={classes.container}>
          <div class={classes.title}>{props.title}</div>
          <div class={classes.code} ref={containerRef}></div>
        </div>
      )
    }
  }
})
