
import fSchema from 'fluent-schema';

const bodyJsonSchema = fSchema.object();

const queryStringJsonSchema = fSchema.object();

const paramsJsonSchema = fSchema.object();

const headersJsonSchema = fSchema.object();
  // .prop('x-jwt', fSchema.string().required());

// Note that there is no need to call `.valueOf()`!
export const schema = {
  body: bodyJsonSchema,
  querystring: queryStringJsonSchema, // (or) query: queryStringJsonSchema
  params: paramsJsonSchema,
  headers: headersJsonSchema,
};
