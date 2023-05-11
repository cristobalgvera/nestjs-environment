type Detail = string | string[];

export class DetailedError extends Error {
  constructor(detail: Detail) {
    super(DetailedError.prettifyDetail(detail));
  }

  private static prettifyDetail(detail: Detail): string {
    const limiter = '------------------------';
    const message = Array.isArray(detail) ? detail.join('\n') : detail;

    return [limiter, message, limiter].join('\n');
  }
}
