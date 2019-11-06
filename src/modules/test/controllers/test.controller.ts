import Controller from '_core/_base/_controller/controller';
import { TestRepository } from '../repositories/test.repository';

export class TestController extends Controller {
  private repository: TestRepository;
  constructor() {
    super();
    this.repository = new TestRepository();
  }
  public initializeRoutes() {}
}
