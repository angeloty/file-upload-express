import HttpException from '../../../_exceptions/HttpException';

class UserNotFoundException extends HttpException {
  constructor() {
    super(404, 'User not found');
  }
}

export default UserNotFoundException;
