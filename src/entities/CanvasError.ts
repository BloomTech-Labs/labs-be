export type CanvasError = {
  status: string
  errors: Record<string,string>[]
};

export const isCanvasError = (x: unknown): x is CanvasError => {
  if ((x as CanvasError).errors) {
    return true;
  }
  return false;
}