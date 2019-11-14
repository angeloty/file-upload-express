import HttpException from '../../../_exceptions/HttpException';

class NotAuthorizedException extends HttpException {
  constructor() {
    super(403, "You're not authorized");
  }
}

export default NotAuthorizedException;
