/**
 * Keeps count of the number of times a post or page has been visited
 * Distinguish between visit count and visitor count
 * When page is first visited, it sets a visited item in localstorage
 * subsequent visits would only increase visit_count, return_count not Unique_visitor_count
 * Exposes a meta field on every post type vs save to separate table
 */