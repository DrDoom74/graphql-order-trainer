
declare module 'lodash' {
  export function pick<T extends object, K extends keyof T>(
    object: T, 
    props: K[]
  ): Pick<T, K>;

  export function upperFirst(string?: string): string;
}
