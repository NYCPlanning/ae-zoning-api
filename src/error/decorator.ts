import { DataRetrievalException } from "./exception";

export function CatchDataRetrievalException <Fn extends (...args: any[]) => any>(
  target: Fn,
  _context: ClassMethodDecoratorContext<ThisParameterType<Fn>, Fn>,
) {
  return function replacementMethod(this: ThisParameterType<Fn>, ...args: Parameters<Fn>): ReturnType<Fn> {
    try {
      return target.call(this, ...args);
    } catch {
      throw DataRetrievalException;
    }
  };
}
