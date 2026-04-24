import Papa from 'papaparse';

export interface ChallengeRow {
  id: string;
  title: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'hard' | 'expert';
  category: string;
  domain?: string;
  constraints?: string;
  example_prompt?: string;
  expected_outcome?: string;
  base_points: number;
  is_premium: boolean | number;
  course_name?: string;
  course_id?: string;
  total_attempts?: number;
  success_rate?: number;
  tags?: string;
  company_context?: string;
  created_date?: string;
}

/**
 * Parses CSV content and returns structured challenge objects
 */
export function parseChallengeCsv(csvContent: string): ChallengeRow[] {
  const result = Papa.parse<ChallengeRow>(csvContent, {
    header: true,
    skipEmptyLines: true,
    dynamicTyping: (field) => {
      // Parse numeric fields
      if (['base_points', 'total_attempts', 'success_rate'].includes(field)) {
        return true;
      }
      return false;
    },
    transformHeader: (header) => header.toLowerCase().trim(),
  });

  if (result.errors.length > 0) {
    console.error('CSV parsing errors:', result.errors);
  }

  // Filter and validate challenges
  return result.data
    .filter((row): row is ChallengeRow => {
      return Boolean(
        row.id &&
          row.title &&
          row.description &&
          row.difficulty &&
          row.category
      );
    })
    .map((row) => ({
      ...row,
      base_points: Number(row.base_points) || 100,
      is_premium:
        typeof row.is_premium === 'string'
          ? row.is_premium.toLowerCase() === 'true'
          : Boolean(row.is_premium),
      total_attempts: Number(row.total_attempts) || 0,
      success_rate: Number(row.success_rate) || 0,
    }));
}

/**
 * Seed challenges to the database via API
 */
export async function seedChallengesToAPI(
  apiUrl: string,
  challenges: ChallengeRow[],
  authToken?: string
): Promise<{ success: number; failed: number; errors: string[] }> {
  const errors: string[] = [];
  let success = 0;
  let failed = 0;

  for (const challenge of challenges) {
    try {
      const response = await fetch(`${apiUrl}/api/challenges`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(authToken && { Authorization: `Bearer ${authToken}` }),
        },
        body: JSON.stringify({
          ...challenge,
          points: challenge.base_points,
        }),
      });

      if (response.ok) {
        success++;
      } else {
        failed++;
        errors.push(`${challenge.id}: ${response.statusText}`);
      }
    } catch (error) {
      failed++;
      errors.push(`${challenge.id}: ${String(error)}`);
    }
  }

  return { success, failed, errors };
}

/**
 * Fetch CSV from a URL and seed challenges
 */
export async function seedChallengesFromUrl(
  csvUrl: string,
  apiUrl: string,
  authToken?: string
): Promise<{ success: number; failed: number; errors: string[] }> {
  try {
    const response = await fetch(csvUrl);
    const csvContent = await response.text();
    const challenges = parseChallengeCsv(csvContent);

    return seedChallengesToAPI(apiUrl, challenges, authToken);
  } catch (error) {
    return {
      success: 0,
      failed: 0,
      errors: [String(error)],
    };
  }
}
