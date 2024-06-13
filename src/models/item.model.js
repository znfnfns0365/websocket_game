const items = {};

export const createItem = (uuid) => {
  items[uuid] = [];
};

export const getItem = (uuid) => {
  return items[uuid];
};

export const addItem = (uuid, itemId, timestamp) => {
  items[uuid].push({ itemId, timestamp });
};

export const clearItem = (uuid) => {
  items[uuid] = [];
};
