export class InvalidModelDataException extends Error {
  protected field: string;
  constructor(field: string, message?: string) {
    super(message);
    this.field = field;
    this.name = 'model-invalid-data';
  }
}

export default InvalidModelDataException;
