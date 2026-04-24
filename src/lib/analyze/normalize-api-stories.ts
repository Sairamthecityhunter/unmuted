import type { PostTypeId } from "@/lib/constants/post-types";
import { POST_TYPES } from "@/lib/constants/post-types";
import { isStoryCategoryId } from "@/lib/taxonomy/categories";
import type { Story } from "@/types/story";

const POST_TYPE_IDS = new Set<string>(POST_TYPES.map((p) => p.id));

function parsePostType(v: unknown): PostTypeId | undefined {
  const s = String(v ?? "");
  return POST_TYPE_IDS.has(s) ? (s as PostTypeId) : undefined;
}

/** Parse `GET /api/stories` JSON into canonical {@link Story} rows (drops invalid categories). */
export function storiesFromApiJson(raw: unknown): Story[] {
  if (!raw || !Array.isArray(raw)) return [];
  const out: Story[] = [];
  for (const item of raw) {
    if (item == null || typeof item !== "object") continue;
    const s = item as Record<string, unknown>;
    const id = String(s.id ?? "");
    if (!id.length) continue;
    const category = String(s.category ?? "");
    if (!isStoryCategoryId(category)) continue;

    const companyRaw = s.company != null ? String(s.company).trim() : "";
    out.push({
      id,
      title: String(s.title ?? ""),
      body: String(s.body ?? ""),
      category,
      createdAt: String(s.createdAt ?? ""),
      isAnonymous: Boolean(s.isAnonymous),
      authorDisplayName:
        s.authorDisplayName != null ? String(s.authorDisplayName) : undefined,
      supportCount: Math.max(0, Math.floor(Number(s.supportCount ?? 0) || 0)),
      importantCount: Math.max(0, Math.floor(Number(s.importantCount ?? 0) || 0)),
      relateCount: Math.max(0, Math.floor(Number(s.relateCount ?? 0) || 0)),
      tags: Array.isArray(s.tags) ? s.tags.map((t) => String(t)) : [],
      company: companyRaw.length > 0 ? companyRaw : undefined,
      postType: parsePostType(s.postType),
      submittedByCommunity: Boolean(s.submittedByCommunity),
    });
  }
  return out;
}
