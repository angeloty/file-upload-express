export const ControllerDecorator = (prefix: string = ''): ClassDecorator => {
  return (target: Function) => {
    console.log(`Controller: ${target.name} ......... Initializing`);
    target.prototype.getPath = () => {
      return prefix;
    };
  };
};

export default ControllerDecorator;
