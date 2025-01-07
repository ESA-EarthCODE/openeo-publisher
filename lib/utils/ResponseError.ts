export class ResponseError extends Error {
    private _statusCode: number;
    private statusText: string;

    constructor(statusCode: number, statusText: string, message: string) {
        super(message);
        this._statusCode = statusCode;
        this.statusText = statusText;
    }

    toString(): string {
        return `${this._statusCode} - ${this.statusText} - ${this.message}`;
    }

    get statusCode(): number {
        return this._statusCode;
    }

    set statusCode(value: number) {
        this._statusCode = value;
    }

}