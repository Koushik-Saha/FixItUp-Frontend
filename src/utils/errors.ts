// lib/utils/errors.ts
// API error handling

export class APIError extends Error {
    statusCode: number
    code: string

    constructor(message: string, statusCode: number = 500, code: string = 'INTERNAL_ERROR') {
        super(message)
        this.name = 'APIError'
        this.statusCode = statusCode
        this.code = code
    }
}

export class ValidationError extends APIError {
    errors: Record<string, string[]>

    constructor(message: string, errors: Record<string, string[]>) {
        super(message, 400, 'VALIDATION_ERROR')
        this.errors = errors
    }
}

export class NotFoundError extends APIError {
    constructor(resource: string) {
        super(`${resource} not found`, 404, 'NOT_FOUND')
    }
}

export class UnauthorizedError extends APIError {
    constructor(message: string = 'Unauthorized') {
        super(message, 401, 'UNAUTHORIZED')
    }
}

export class ForbiddenError extends APIError {
    constructor(message: string = 'Forbidden') {
        super(message, 403, 'FORBIDDEN')
    }
}

export class ConflictError extends APIError {
    constructor(message: string) {
        super(message, 409, 'CONFLICT')
    }
}

// Error response formatter
export function errorResponse(error: unknown) {
    if (error instanceof ValidationError) {
        return Response.json(
            {
                error: error.message,
                code: error.code,
                errors: error.errors,
            },
            { status: error.statusCode }
        )
    }

    if (error instanceof APIError) {
        return Response.json(
            {
                error: error.message,
                code: error.code,
            },
            { status: error.statusCode }
        )
    }

    // Generic error
    console.error('Unhandled error:', error)
    return Response.json(
        {
            error: 'Internal server error',
            code: 'INTERNAL_ERROR',
        },
        { status: 500 }
    )
}
