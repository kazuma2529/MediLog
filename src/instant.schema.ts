// Docs: https://www.instantdb.com/docs/modeling-data

import { i } from "@instantdb/react";

const _schema = i.schema({
  entities: {
    $users: i.entity({
      email: i.string().unique().indexed().optional(),
      imageURL: i.string().optional(),
      type: i.string().optional(),
    }),
    medications: i.entity({
      name: i.string().indexed(),
      dosage: i.string(),
      memo: i.string().optional(),
      timings: i.string(), // JSON array e.g. ["morning","noon"]
      isActive: i.boolean().indexed(),
      startDate: i.number().indexed(), // YYYYMMDD
      createdAt: i.number().indexed(),
    }),
    intakeLogs: i.entity({
      date: i.number().indexed(), // YYYYMMDD
      timing: i.string().indexed(),
      takenAt: i.number(),
      createdAt: i.number().indexed(),
    }),
  },
  links: {
    userMedications: {
      forward: {
        on: "medications",
        has: "one",
        label: "user",
        onDelete: "cascade",
      },
      reverse: {
        on: "$users",
        has: "many",
        label: "medications",
      },
    },
    medicationIntakeLogs: {
      forward: {
        on: "intakeLogs",
        has: "one",
        label: "medication",
        onDelete: "cascade",
      },
      reverse: {
        on: "medications",
        has: "many",
        label: "intakeLogs",
      },
    },
  },
});

// This helps TypeScript display nicer intellisense
type _AppSchema = typeof _schema;
interface AppSchema extends _AppSchema {}
const schema: AppSchema = _schema;

export type { AppSchema };
export default schema;
