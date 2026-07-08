/**
 * Safe JSON fetch – gracefully handles cases where the backend server
 * is unreachable and returns an empty or HTML response instead of JSON.
 */
export async function safeFetch(url, options = {}) {
  const res = await fetch(url, options);
  const text = await res.text();
  let data = null;
  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      data = null;
    }
  }
  return { res, data };
}

export default safeFetch;
