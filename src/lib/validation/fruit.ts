import { Static, Type } from "@sinclair/typebox";

export const fruitsSchema = Type.Object(
    {
        name: Type.String(),
        kg: Type.Integer(),
    },
    { additionalProperties: false }
);

export type FruitsData = Static<typeof fruitsSchema>;
