declare module 'easy-currencies' {
  interface IChainer {
    /** Sets the source currency. */
    from(currency: string): IChainer
    /** Converts to the target currency and returns the rate. */
    to(currency: string): Promise<number>
  }

  /** Creates a chainable converter for the given amount. */
  export function Convert(amount: number): IChainer
}
