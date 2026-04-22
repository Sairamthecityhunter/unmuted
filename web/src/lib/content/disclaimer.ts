/**
 * Shared disclaimer copy — use in components and the legal-style disclaimer page.
 * Not a substitute for counsel-reviewed Terms; refine before public launch at scale.
 */

export const DISCLAIMER_PAGE_TITLE = "Disclaimer";

export const DISCLAIMER_SHORT_LEDE =
  "All visible posts are user-submitted personal experiences. Unmuted does not independently verify facts, identities, or timelines. Nothing here should be treated as a formal accusation, legal finding, or official record.";

export const DISCLAIMER_FULL_SECTIONS: {
  heading: string;
  paragraphs: string[];
}[] = [
  {
    heading: "User-submitted content",
    paragraphs: [
      "Unmuted hosts first-person accounts and community discussion. Authors are responsible for what they post within our community guidelines. The platform does not endorse every statement made by users.",
    ],
  },
  {
    heading: "No independent verification",
    paragraphs: [
      "We do not fact-check, investigate, or corroborate posts before they appear. Information may be incomplete, contested, or mistaken. Readers should treat each story as one person’s perspective—not as proven fact.",
    ],
  },
  {
    heading: "Not a formal accusation",
    paragraphs: [
      "Publishing on Unmuted is not the same as filing a complaint with an employer, regulator, or court. A post must not be treated as a formal accusation, charge, or legal conclusion against any person or organization.",
      "Employers, media, and others should not rely on this site as a sole basis for employment, legal, or disciplinary decisions.",
    ],
  },
  {
    heading: "Not professional advice",
    paragraphs: [
      "Nothing on Unmuted is legal, medical, financial, or other professional advice. For those matters, consult a qualified professional in your jurisdiction.",
    ],
  },
  {
    heading: "Moderation and removal",
    paragraphs: [
      "We may remove or limit content that violates our guidelines or creates serious risk. Moderation is imperfect; we aim to be fair and to offer appeals where we say we will.",
    ],
  },
];
