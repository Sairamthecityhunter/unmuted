/**
 * Cross-cutting primitives for API/DB boundaries.
 *
 * - Use ISO 8601 strings at the edge (JSON); convert to Date in app code when needed.
 * - Use opaque string IDs (cuid, uuid, ulid) as returned by the database.
 */

/** ISO 8601 datetime string, e.g. from `timestamptz` columns. */
export type ISODateString = string;

/** Primary / foreign key string from the database. */
export type DbId = string;
