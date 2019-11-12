export const controller = (prefix: string = ''): ClassDecorator => {
  return (target: Function) => {
    console.log(`Controller: ${target.name} ......... Initializing`);
    target.prototype.getPath = () => {
      return prefix;
    };
  };
};

export default controller;
