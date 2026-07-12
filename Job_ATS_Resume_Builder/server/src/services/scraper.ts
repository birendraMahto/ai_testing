import * as cheerio from 'cheerio';

export async function scrapeUrl(url: string): Promise<string> {
  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch URL: ${response.statusText}`);
    }

    const html = await response.text();
    const $ = cheerio.load(html);

    // Remove unwanted elements
    $('script').remove();
    $('style').remove();
    $('nav').remove();
    $('footer').remove();
    $('header').remove();
    $('noscript').remove();
    
    // Extract text from body
    const text = $('body').text();
    
    // Clean up whitespace
    return text.replace(/\s+/g, ' ').trim();
  } catch (error: any) {
    throw new Error(`Scraping failed: ${error.message}. Note: Some sites like LinkedIn block automated scrapers. Please paste the job description manually if this persists.`);
  }
}
