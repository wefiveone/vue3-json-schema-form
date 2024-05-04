import Ajv from "ajv";
import toPath from "lodash.topath";
const i18n = require('ajv-i18n')

import { Schema } from "./types";
import { isObject } from "./utils";

interface TransformedErrorObject {
  name: string,
  property: string,
  message: string,
  params: Ajv.ErrorParameters,
  schemaPath: string
}
interface ErrorSchemaObject {
  [level: string]: ErrorSchema
}
export type ErrorSchema = ErrorSchemaObject & {
  __errors?: string[]
}

function toErrorSchema(errors: TransformedErrorObject[]) {
  if (errors.length ===0 ) return {}
  return errors.reduce((errorSchema, error) => {
    const { property = '', message } = error
    //  n_ > _.toPath('/name/firstName') // => [ '/name/firstName' ]
    // _.toPath('a.b.c'); // => ['a', 'b', 'c']
    // _.toPath('a[0].b.c'); // => ['a', '0', 'b', 'c']
    const path = toPath(property) //x /obj/a -> [obj, a]
    // const path = property.split('/') //√ /obj/a -> [obj, a]
    let parent = errorSchema

    // If the property is at the root (.level1) then toPath creates
    // an empty array element at the first index. Remove it.
    if (path.length > 0 && path[0] === '') {
      path.splice(0, 1)
    }

    // {
    //   obj: {
    //     a: {}
    //   }
    // }
    // /obj/a
    for (const segment of path.slice(0)) {
      if (!(segment in parent)) {
        (parent as any)[segment] = {}
      }
      parent = parent[segment]
    }

    // {
    //   obj: {
    //     a: {__errors: [message]}
    //   }
    // }
    if (Array.isArray(parent.__errors)) {
      parent.__errors = parent.__errors.concat(message || '')
    } else {
      if (message) {
        parent.__errors = [message]
      }
    }

    return errorSchema
  }, {} as ErrorSchema)
}

function transformErrors(errors: Ajv.ErrorObject[] | undefined | null) {
  if (errors === undefined || errors === null) return []
  return errors.map(({ message, dataPath, keyword, params, schemaPath }) => {
    return {
      name: keyword,
      property: `${dataPath}`,
      message,
      params,
      schemaPath 
    }
  }) as TransformedErrorObject[]
}

export async function validateFormData(
  validator: Ajv.Ajv,
  formData: any,
  schema: Schema,
  locale = 'zh',
  customValidate?: (formData: any, errors: any) => void
) {

  let validationError = null

  try {
    validator.validate(schema, formData)
  } catch(err) {
    validationError = err as any
  }

  // 翻译错误信息为中文
  i18n[locale](validationError)

  // 转换错误信息格式
  let errors = transformErrors(validator.errors)

  // 添加上catch中捕获的错误信息
  if (validationError) {
    errors = [
      ...errors,
      {
        message: validationError.message,
      } 
    ] as TransformedErrorObject[]
  }

  // 转化为错误信息树形式
  // { o: { a: { __error: "" } } }
  const errorSchema = toErrorSchema(errors)

  // 没有自定义校验函数，直接返回结果
  if (!customValidate) {
    return {
      errors,
      errorSchema,
      valid: errors.length === 0
    }
  }

  // 有自定义校验函数，校验，得到校验错误信息，合并
  const errorProxy = createErrorProxy()
  await customValidate(formData, errorProxy)

  const newErrorSchema = mergeObjects(errorProxy, errorSchema, true)

  return {
    errors,
    errorSchema: newErrorSchema,
    valid: errors.length === 0
  }
}

function createErrorProxy() {
  const raw = {}
  return new Proxy(raw, {
    get(target, key) {
      if (key === 'addError') {
        return (message: string) => {
          const __errors = Reflect.get(target, '__errors')
          if (__errors && Array.isArray(__errors)) {
            __errors.push(message)
          } else {
            Reflect.set(target, '__errors', [message])
          }
        }
      }

      const res = Reflect.get(target, key)

      if (res === undefined) {
        const p: any = createErrorProxy()
        Reflect.set(target, key, p)
        return p
      }

      return res
    }
  })
}

export function mergeObjects(obj1: any, obj2: any, concatArrays = false) {
  // Recursively merge deeply nested objects
  const accumulator = Object.assign({}, obj1) // Prevent mutation of source object
  return Object.keys(obj2).reduce((accumulator, key) => {
    const left = obj1 ? obj1[key] : {}
    const right = obj2[key]
    if (obj1 && obj1.hasOwnProperty(key) && isObject(right)) {
      accumulator[key] = mergeObjects(left, right, concatArrays) // 递归
    } else if (concatArrays && Array.isArray(left) && Array.isArray(right)) {
      accumulator[key] = left.concat(right)
    } else {
      accumulator[key] = right
    }
    return accumulator
  }, accumulator)
}