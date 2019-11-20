import HttpException from '../../../_exceptions/HttpException';

class InvalidUserDataException extends HttpException {
  constructor() {
    super(400, 'Invalid User data provided');
  }
}

export default InvalidUserDataException;
