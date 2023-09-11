import { Request } from 'express';

interface CustomRequest extends Request {
  originalBody?: Buffer;
}

export default CustomRequest;
