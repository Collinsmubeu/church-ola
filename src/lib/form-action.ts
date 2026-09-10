type AnyFn = (...args: any[]) => Promise<any> | any;

export function asFormAction<T extends AnyFn>(fn: T): (formData: FormData) => void {
  return (formData: FormData) => {
    fn(formData);
  };
}