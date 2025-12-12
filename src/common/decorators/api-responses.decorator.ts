import { applyDecorators } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';

export function CustomApiUnauthorizedResponse() {
  return applyDecorators(
    ApiResponse({
      status: 401,
      description: 'Unauthorized',
      schema: {
        example: {
          message: 'Unauthorized',
          statusCode: 401,
        },
      },
    })
  );
}

// You can also create other common responses
export function CustomApiBadRequestResponse(message: string) {
  return applyDecorators(
    ApiResponse({
      status: 400,
      description: 'Bad Request',
      schema: {
        example: {
          message,
          statusCode: 400,
        },
      },
    })
  );
}

export function CustomApiNotFoundResponse() {
  return applyDecorators(
    ApiResponse({
      status: 404,
      description: 'Not Found',
      schema: {
        example: {
          message: 'Resource not found',
          statusCode: 404,
        },
      },
    })
  );
}

// Combine multiple common responses
export function CustomApiCommonResponses() {
  return applyDecorators(
    CustomApiUnauthorizedResponse(),
    CustomApiBadRequestResponse('Bad Request'),
  );
}
