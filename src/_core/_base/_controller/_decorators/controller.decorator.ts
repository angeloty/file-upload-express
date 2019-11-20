export const Controller = (config: {path: string}): ClassDecorator => {
  return (target: Function) => {
    console.log(`Controller: ${target.name} ......... Initializing`);
    target.prototype.getPath = () => {
      return config.path;
    };
  };
};

export default Controller;
