export const dot = (a: number[], b: number[]) => {
  let sum = 0;
  for (let i = 0; i < a.length; i++) sum += a[i] * b[i];
  return sum;
};

export interface Scored<T> {
  item: T;
  score: number;
}

// Rank items by cosine similarity (vectors are already normalised).
export const topK = <T extends { embedding: number[] }>(
  query: number[],
  items: T[],
  k = 5,
  minScore = 0.3
): Scored<T>[] =>
  items
    .map((item) => ({ item, score: dot(query, item.embedding) }))
    .filter((s) => s.score >= minScore)
    .sort((a, b) => b.score - a.score)
    .slice(0, k);
