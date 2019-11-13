import { AdapterModelDefinition } from '_core/_db/_adapters/adapterModelDef';

export const modelRegistry: { [key: string]: AdapterModelDefinition } = {};

export class Registry {
  public static addModelDef(
    name: string,
    modelDef: AdapterModelDefinition
  ): boolean {
    if (Object.keys(modelRegistry).some((prop: string) => name === prop)) {
      return false;
    }
    modelRegistry[name] = modelDef;
    return true;
  }
  public static getModelDef(name: string): AdapterModelDefinition {
    return Object.keys(modelRegistry).some((prop: string) => name === prop)
      ? modelRegistry[name]
      : null;
  }
}

export default Registry;
