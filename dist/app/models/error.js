"use strict";
// Input Errors
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConfigurationError = exports.ServerError = exports.UnauthorizedError = exports.NonExistentResourceError = exports.InvalidInputError = void 0;
class InvalidInputError extends Error {
    constructor(inputType) {
        super(`Invalid or malformed input provided: ${inputType}`);
        Object.setPrototypeOf(this, InvalidInputError.prototype);
    }
}
exports.InvalidInputError = InvalidInputError;
class NonExistentResourceError extends Error {
    constructor(resourceType, resourceName) {
        super(`Resource does not exist: ${resourceType}{${resourceName}}`);
        Object.setPrototypeOf(this, NonExistentResourceError.prototype);
    }
}
exports.NonExistentResourceError = NonExistentResourceError;
// Authorization Errors
class UnauthorizedError extends Error {
    constructor(message) {
        super(message);
        Object.setPrototypeOf(this, UnauthorizedError.prototype);
    }
}
exports.UnauthorizedError = UnauthorizedError;
// Server Errors
class ServerError extends Error {
    constructor(message) {
        super(message);
        Object.setPrototypeOf(this, ServerError.prototype);
    }
}
exports.ServerError = ServerError;
class ConfigurationError extends Error {
    constructor(message) {
        super(message);
        Object.setPrototypeOf(this, ConfigurationError.prototype);
    }
}
exports.ConfigurationError = ConfigurationError;
