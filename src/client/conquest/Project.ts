/** The derivative launcher opts in; inherited OpenFront tests keep their defaults. */
export function isEmpireFrontStandalone(): boolean {
  return (
    typeof document !== "undefined" &&
    document.documentElement.dataset.project === "empirefront"
  );
}
