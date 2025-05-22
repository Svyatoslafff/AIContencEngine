import {
    ExceptionFilter,
    Catch,
    ArgumentsHost,
    HttpException,
    HttpStatus,
    Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { MongoError } from 'mongodb';
import { Error as MongooseError } from 'mongoose';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
    private readonly logger = new Logger(AllExceptionsFilter.name);

    catch(exception: unknown, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();

        let status = HttpStatus.INTERNAL_SERVER_ERROR;
        let message: string | string[] = 'Internal server error';

        if (exception instanceof HttpException) {
            status = exception.getStatus();
            const res = exception.getResponse();
            message = typeof res === 'string' ? res : (res as any).message;
        } else if (
            typeof exception === 'object' &&
            exception !== null &&
            'code' in exception
        ) {
            const mongoError = exception as MongoError;
            if (mongoError.code === 11000) {
                status = HttpStatus.CONFLICT;
                message = 'Duplicate key error';
            }
        } else if (exception instanceof MongooseError.ValidationError) {
            status = HttpStatus.BAD_REQUEST;
            message = Object.values(exception.errors).map(err => err.message);
        } else if (exception instanceof MongooseError.CastError) {
            status = HttpStatus.BAD_REQUEST;
            message = `Invalid ${exception.path}: ${exception.value}`;
        }

        this.logger.error(
            `Status: ${status} Error: ${JSON.stringify(exception)}`
        );

        response.status(status).json({
            statusCode: status,
            message,
            path: request.url,
            timestamp: new Date().toISOString(),
        });
    }
}
