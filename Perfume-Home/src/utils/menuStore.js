const MENU_KEY = "perfume-items";

export const getItems = () => {
  try {
    return JSON.parse(localStorage.getItem(MENU_KEY)) || [];
  } catch {
    return [];
  }
};

export const addMany = (items) => {
  const current = getItems();
  const updated = [...current, ...items];
  localStorage.setItem(MENU_KEY, JSON.stringify(updated));
};

export const updateItem = (id, updated) => {
  const list = getItems().map(it => it.id === id ? updated : it);
  localStorage.setItem(MENU_KEY, JSON.stringify(list));
};

export const removeItem = (id) => {
  const filtered = getItems().filter(it => it.id !== id);
  localStorage.setItem(MENU_KEY, JSON.stringify(filtered));
};

export const clearItems = () => {
  localStorage.removeItem(MENU_KEY);
};
