import PasswordWidget from "@/components/PassWordWidget"

export default {
  name: 'Demo',
  schema: {
    type: 'object',
    title: 'Demo',
    properties: {
      pass1: {
        type: 'string',
        title: 'password',
        minLength: 3,
      },
      pass2: {
        type: 'string',
        title: 're try password',
        minLength: 3
      },
      color: {
        type: 'string',
        format: 'color',
        title: 'Input Color'
      }
    }
  },
  uiSchema: {
    properties: {
      pass1: {
        widget:  PasswordWidget
      },
      pass2: {
        color: 'red'
      }
    }
  },
  default: 1,
  async customValidate(data: any, errors: any) {
    return new Promise((resolve) => {
      setTimeout(() => {
        if (data.pass1 !== data.pass2) {
          errors.pass2.addError('password not match')
        }
        resolve(1)
      }, 1000)
    })
  }
}