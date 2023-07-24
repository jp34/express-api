
export class InvalidInputError extends Error {
    constructor(inputType: string) {
        super(`Invalid or malformed input provided: ${inputType}`);
        Object.setPrototypeOf(this, InvalidInputError.prototype);
    }
}

export class InvalidOperationError extends Error {
    constructor(message: string) {
        super(message);
        Object.setPrototypeOf(this, InvalidOperationError.prototype);
    }
}

export class NonExistentResourceError extends Error {
    constructor(resourceType: string, resourceName: string) {
        super(`Resource does not exist: ${resourceType}:${resourceName}`);
        Object.setPrototypeOf(this, NonExistentResourceError.prototype);
    }
}

export class UnauthorizedError extends Error {
    constructor(message: string) {
        super(message);
        Object.setPrototypeOf(this, UnauthorizedError.prototype);
    }
}

export class ServerError extends Error {
    constructor(message: string) {
        super(message);
        Object.setPrototypeOf(this, ServerError.prototype);
    }
}

export class ConfigurationError extends Error {
    constructor(message: string) {
        super(message);
        Object.setPrototypeOf(this, ConfigurationError.prototype);
    }
}
