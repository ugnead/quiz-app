export function partialDisplay(
  text: string,
  firstCount: number,
  lastCount: number,
  ellipsis = "..."
): string {
  if (text.length <= firstCount + lastCount) {
    return text;
  }

  const start = text.slice(0, firstCount);
  const end = lastCount > 0 ? text.slice(-lastCount) : "";
  return `${start}${ellipsis}${end}`;
}

export function shortId(id: string): string {
  return partialDisplay(id, 0, 4);
}

export function shortName(name: string): string {
  return partialDisplay(name, 20, 0);
}
