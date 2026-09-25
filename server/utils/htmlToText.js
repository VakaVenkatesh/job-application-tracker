/**
 * Strips HTML tags from a string and cleans up whitespace.
 * Used to convert job description HTML from APIs into plain text.
 */
function stripHtml(html) {
  if (!html) return '';
  return html
    .replace(/<[^>]*>/g, ' ')       // Remove HTML tags
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#x27;/g, "'")
    .replace(/&#x26;/g, '&')
    .replace(/&nbsp;/g, ' ')
    .replace(/\\n/g, '\n')
    .replace(/\s+/g, ' ')           // Collapse multiple whitespace
    .trim()
    .substring(0, 2000);            // Limit length
}

module.exports = { stripHtml };
