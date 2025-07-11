import { Request, Response, NextFunction } from 'express';
import { ObjectSchema } from 'joi';

export function validateParams(schema: ObjectSchema) {
  return (req: Request, res: Response, next: NextFunction) => {
          
    const { error } = schema.validate({
      body: req.body,
      query: req.query,
      headers: req.headers        
    });

    if (error) {
      res.status(400).send("VALIDATE_PARAMS_ERROR");
      return;
    }

    next();
  };
}