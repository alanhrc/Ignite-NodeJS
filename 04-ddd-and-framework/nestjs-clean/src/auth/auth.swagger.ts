export const authSchemaResponse = {
  default: {
    type: 'object',
    properties: {
      message: {
        oneOf: [
          { type: 'string' },
          {
            type: 'array',
            items: {
              type: 'string',
            },
          },
        ],
      },
      error: { type: 'string' },
      statusCode: { type: 'number' },
    },
  },
  signIn: {
    type: 'object',
    properties: {
      access_token: { type: 'string' },
    },
  },
}
