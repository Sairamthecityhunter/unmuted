/** localStorage key for a comment’s delete secret (set when you post). */
export function commentDeleteStorageKey(commentId: string) {
  return `unmuted:commentDelete:${commentId}`;
}
