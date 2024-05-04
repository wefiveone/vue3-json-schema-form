export default {
  name: "Simple",
  schema: {
    description: "A simple example",
    type: "object",
    required: ["firstName", "lastName"],
    properties: {
      firstName: {
        type: "string",
        title: 'firstName',
        default: "John",
      },
      lastName: {
        type: "string",
        title: "lastName",
      },
      telephone: {
        type: "string",
        title: "Telephone",
        minLength: 10,
      },
      staticArray: {
        type: "array",
        items: [
          {
            type: "string",
          },
          {
            type: "number",
          },
        ],
      },
      singleTypeArray: {
        type: "array",
        title: "singleTypeArray",
        items: { type: "string" },
      },
      multiSelectArray: {
        type: "array",
        title: "multiSelectArray",
        items: { type: "string", enum: ["a", "b", "c", "d"] },
      },
    },
  },
  uiSchema: {
    title: "A registration form",
    properties: {
      firstName: {
        title: "First name",
      },
      lastName: {
        title: "Last name",
      },
      telephone: {
        title: "Telephone",
      },
    },
  },
  default: {
    firstName: "John",
    lastName: "we",
    singleTypeArray: ["a", "b"],
  },
};
