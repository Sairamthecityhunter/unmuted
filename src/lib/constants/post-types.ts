/**
 * How the author intends the post to be read — stored with submission when API exists.
 */
export const POST_TYPES = [
  {
    id: "personal-experience",
    label: "Personal experience",
    description: "What happened to you, in your own words.",
  },
  {
    id: "seeking-advice",
    label: "Seeking advice or perspective",
    description: "You want ideas, validation, or options—not legal advice from the platform.",
  },
  {
    id: "resource-share",
    label: "Resource or what helped",
    description: "Templates, orgs, or steps that helped you navigate a situation.",
  },
  {
    id: "follow-up",
    label: "Update or follow-up",
    description: "New information after a previous situation or post.",
  },
  {
    id: "other",
    label: "Other",
    description: "Doesn’t fit the above—briefly explain in the story field.",
  },
] as const;

export type PostTypeId = (typeof POST_TYPES)[number]["id"];
