const Ajv = require("ajv")
const ajv = new Ajv()

const schema = {
  type: "string",
  minLength: 10
}

const validate = ajv.compile(schema)
const valid = validate('wy')
if (!valid) console.log(validate.errors)
