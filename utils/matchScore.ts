export function getMatchScore(mySubjects: string[], theirSubjects: string[]) {
  if (!mySubjects?.length || !theirSubjects?.length) {
    return { score: 0, label: "No match" };
  }
  const matches = mySubjects.filter((s) => theirSubjects.includes(s));
  const score = Math.round((matches.length / mySubjects.length) * 100);
  let label = "Low match";
  if (score >= 70) label = "Strong match";
  else if (score >= 40) label = "Good match";
  return { score, label };
}