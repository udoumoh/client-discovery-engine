import Exa from "exa-js";

export interface ExaResult {
  title: string;
  url: string;
  snippet: string;
}

/**
 * Fetches context from Exa AI for a given query
 * @param query Search query string
 * @returns Array of simplified search results with title, url, and snippet
 */
export async function fetchExaContext(query: string): Promise<ExaResult[]> {
  // Return empty array if query is empty or just whitespace
  if (!query || query.trim().length === 0) {
    return [];
  }

  try {
    const apiKey = process.env.EXA_API_KEY;

    if (!apiKey) {
      console.warn("EXA_API_KEY not found in environment variables");
      return [];
    }

    const exa = new Exa(apiKey);

    // Search with contents to get text snippets
    const result = await exa.searchAndContents(query, {
      numResults: 5,
      useAutoprompt: true,
      text: {
        maxCharacters: 600,
      },
    });

    // Transform results into simplified format
    const simplifiedResults: ExaResult[] = result.results.map((item) => ({
      title: item.title || "Untitled",
      url: item.url || "",
      snippet: item.text
        ? item.text.substring(0, 600).trim()
        : "",
    }));

    return simplifiedResults;
  } catch (error) {
    console.error("Error fetching Exa context:", error);
    return [];
  }
}
