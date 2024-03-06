import * as v from 'valibot';

// #################################################################
// # Account Schema
// #################################################################

type GetAccountSchemaArgsFn = { username: string };

export const getAccountSchema = ({ username }: GetAccountSchemaArgsFn) =>
  v.object({
    username: v.literal(username),
  });
