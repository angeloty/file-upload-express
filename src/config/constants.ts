import Adapter from '_core/_db/adapter';

export const appContent: {
  db: {
    adapter: Adapter;
  };
  globals: { [key: string]: any };
} = {
  db: {
    adapter: null
  },
  globals: {}
};
