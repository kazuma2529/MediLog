// Docs: https://www.instantdb.com/docs/permissions

import type { InstantRules } from "@instantdb/react";

const rules = {
  medications: {
    allow: {
      view: "isOwner",
      create: "auth.id != null",
      update: "isOwner",
      delete: "isOwner",
    },
    bind: {
      isOwner: "auth.id != null && auth.id in data.ref('user.id')",
    },
  },
  intakeLogs: {
    allow: {
      view: "isMedicationOwner",
      create: "auth.id != null",
      update: "isMedicationOwner",
      delete: "isMedicationOwner",
    },
    bind: {
      isMedicationOwner:
        "auth.id != null && auth.id in data.ref('medication.user.id')",
    },
  },
  $users: {
    allow: {
      view: "auth.id == data.id",
      update: "auth.id == data.id",
    },
  },
} satisfies InstantRules;

export default rules;
