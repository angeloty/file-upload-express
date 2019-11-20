import HttpException from '../../_exceptions/HttpException';

export class InvalidModelDataException extends HttpException {
  protected field: string;
  constructor(field: string) {
    super(400, `Invalid model data at field: ${field}`);
    this.field = field;
  }
}

export default InvalidModelDataException;
