/** The derivative launcher opts in; inherited OpenFront tests keep their defaults. */
export function isConquestStandalone(): boolean {
  return (
    typeof document !== "undefined" &&
    document.documentElement.dataset.project === "conquest"
  );
}
