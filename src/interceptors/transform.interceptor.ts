import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface Response<T> {
  // We need to include parameters which we always expect on success response
  // message: string;
  // data: T;
}

@Injectable()
export class TransformInterceptor<T>
  implements NestInterceptor<T, Response<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<Response<T>> {
    return next.handle().pipe(
      map((data) => ({
        // ...(data?.status && { status: data?.status }), // To add a status
        // ...(data?.metadata && { metadata: data?.metadata }), // To add a metadata
        // ...(data?.error && { error: data?.error }), // To add error
        // ...(data?.message && { message: data?.message }), // To add a message
        // ...(data?.result && { data: data?.result }), // To add a details of object OR an array of object
        ...(data?.framesCount && { framesCount: data?.framesCount }),
      })),
    );
  }
}
