type AnyFn = (...args: readonly unknown[]) => unknown;

export function asFormAction<T extends AnyFn>(fn: T): (formData: FormData) => void {
  return (formData: FormData) => {
    fn(formData);
  };
}