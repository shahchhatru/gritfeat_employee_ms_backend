import { Request, Response, NextFunction } from "express";


export function errorHandler(err: Error, req: Request, res: Response, next: NextFunction) {
    console.error("An error occurred:", err);

    let statusCode = 500;
    let message = "Internal Server Error !!!!"

    if (err instanceof SyntaxError || err instanceof TypeError) {
        statusCode = 400; // Bad Request
        message = "Invalid JSON format in request body";
    }

    res.status(statusCode).json({statusCode, message})
}
