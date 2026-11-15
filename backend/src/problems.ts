import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from '@nestjs/common';
import { randomUUID } from 'node:crypto';

export const FIELD_ERRORS = 'fieldErrors';

@Catch()
export class ProblemFilter implements ExceptionFilter {
  catch(error: unknown, host: ArgumentsHost) {
    const http = host.switchToHttp();
    const request = http.getRequest();
    const response = http.getResponse();
    const status = error instanceof HttpException ? error.getStatus() : 500;
    const payload = error instanceof HttpException ? error.getResponse() : undefined;
    const details = typeof payload === 'object' ? payload as Record<string, unknown> : {};
    const requestId = response.getHeader('X-Request-Id') ?? randomUUID();
    const detail = status === 500 ? 'An unexpected error occurred.' :
      typeof details.message === 'string' ? details.message : typeof payload === 'string' ? payload : 'Invalid request.';
    response.setHeader('X-Request-Id', requestId);
    response.status(status).type('application/problem+json').json({
      type: 'about:blank',
      title: HttpStatus[status].toLowerCase().replace(/_/g, ' '),
      status, detail, instance: request.path, requestId,
      message: detail,
      ...(details[FIELD_ERRORS] ? { errors: details[FIELD_ERRORS] } : {}),
    });
  }
}
