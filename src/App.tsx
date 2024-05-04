import { defineComponent, reactive, ref, watchEffect } from "vue";
import type { Ref } from "vue";
import { createUseStyles } from "vue-jss";
import MonocaEditor from "./components/MonocaEditor";
import demos from "./demos";
import type { Schema, UISchema } from "../lib/types";
import SchemaForm from "../lib/SchemaForm";
import { ThemeProvider } from "../lib";
import themeDefault from "../lib/theme-default";
import customFormat from './plugins/customFormat'

function toJson(data: any) {
  return JSON.stringify(data, null, 2);
}

const useStyles = createUseStyles({
  container: {
    display: "flex",
    flexDirection: "column",
    height: "100%",
    width: "1200px",
    margin: "0 auto",
  },
  menu: {
    marginBottom: 20,
  },
  code: {
    width: 700,
    flexShrink: 0,
  },
  codePanel: {
    minHeight: 400,
    marginBottom: 20,
  },
  uiAndValue: {
    display: "flex",
    justifyContent: "space-between",
    "& > *": {
      width: "48%",
    },
  },
  content: {
    display: "flex",
  },
  form: {
    padding: "0 20px",
    flexGrow: 1,
  },
  menuButton: {
    appearance: "none",
    borderWidth: 0,
    backgroundColor: "transparent",
    cursor: "pointer",
    display: "inline-block",
    padding: 15,
    borderRadius: 5,
    "&:hover": {
      backgroundColor: "#efefef",
    },
  },
  menuSelected: {
    backgroundColor: "#337ab7",
    color: "#fff",
    "&:hover": {
      background: "#337ab7",
    },
  },
});

export default defineComponent({
  setup() {
    const classesRef = useStyles();

    const selectedRef: Ref<number> = ref(0);
    const demo: {
      schema: Schema | null;
      data: any;
      uiSchema: UISchema | undefined;
      schemaCode: string;
      dataCode: string;
      uiSchemaCode: string;
      customValidate: ((data: any, errors: any) => void) | undefined
    } = reactive({
      schema: null,
      data: {},
      uiSchema: undefined,
      schemaCode: "",
      dataCode: "",
      uiSchemaCode: "",
      customValidate: undefined
    });

    watchEffect(() => {
      const index = selectedRef.value;
      const d: any = demos[index];
      demo.schema = d.schema;
      demo.data = d.default;
      demo.uiSchema = d.uiSchema;
      demo.schemaCode = toJson(d.schema); 
      demo.dataCode = toJson(d.default);
      demo.uiSchemaCode = toJson(d.uiSchema);
      demo.customValidate = d.customValidate;
    });

    const handleChange = (v: any) => {
      demo.data = v;
      demo.dataCode = toJson(v);
      
    };

    const handleCodeChange = (
      filed: "schema" | "data" | "uiSchema",
      value: string
    ) => {
      try {
        const json = JSON.parse(value);
        demo[filed] = json;
        demo[`${filed}Code`] = value;
      } catch (err) {}
    };

    const handleSchemaChange = (v: string) => handleCodeChange("schema", v);
    const handleDataChange = (v: string) => handleCodeChange("data", v);
    const handleUiSchemaChange = (v: string) => handleCodeChange("uiSchema", v);

    const contextRef = ref()

    const validateFrom = () => {
      contextRef.value.doValidate().then((res: any) => {
        console.log(res)
      })
    }


    return () => {
      const classes = classesRef.value;
      const selected = selectedRef.value;

      return (
        <div class={classes.container}>
          <div class={classes.menu}>
            <h3 style={{ margin: "0", fontSize: "24px" }}>
              Vue3 JsonSchema Form
            </h3>
            <div>
              {demos.map((demo, index) => {
                return (
                  <button
                    class={{
                      [classes.menuButton]: true,
                      [classes.menuSelected]: index === selected,
                    }}
                    onClick={() => (selectedRef.value = index)}
                  >
                    {demo.name}
                  </button>
                );
              })}
            </div>
          </div>
          <div class={classes.content}>
            <div class={classes.code}>
              <MonocaEditor
                code={demo.schemaCode}
                onchange={handleSchemaChange}
                title="Schema"
                class={classes.codePanel}
              />
              <div class={classes.uiAndValue}>
                <MonocaEditor
                  code={demo.uiSchemaCode}
                  onchange={handleUiSchemaChange}
                  title="UISchema"
                  class={classes.codePanel}
                />
                <MonocaEditor
                  code={demo.dataCode}
                  class={classes.codePanel}
                  onchange={handleDataChange}
                  title="Value"
                />
              </div>
            </div>
            <div class={classes.form}>
              <ThemeProvider theme={themeDefault}>
                <SchemaForm
                  schema={demo.schema!}
                  value={demo.data}
                  onChange={handleChange}
                  contextRef={contextRef}
                  customValidate={demo.customValidate}
                  uiSchema={demo.uiSchema || {}}
                  customFormats={customFormat}
                  // theme={themeDefault as any}
                />
              </ThemeProvider>
              <button onClick={validateFrom}>校 验</button>
            </div>
          </div>
        </div>
      );
    };
  },
});
