import { useCallback, useEffect, useMemo } from 'react';
import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';

const useSelectItemsStore = create(
  subscribeWithSelector((set) => ({
    items: [],
    identifierKey: 'id',
    setIdentifierKey: (key) =>
      set({
        identifierKey: key,
      }),
    initItems: (initialItems) =>
      set({
        items: initialItems.map((item) => ({
          isSelected: false,
          ...item,
        })),
      }),
    toggleItem: (identifierValue) =>
      set((state) => {
        const { items, identifierKey } = state;
        const itemIndex = items.findIndex((itemFound) => itemFound[identifierKey] === identifierValue);
        const item = items[itemIndex];
        const updatedItems = [...items];
        updatedItems.splice(itemIndex, 1, {
          ...item,
          isSelected: !item.isSelected,
        });
        return { items: updatedItems };
      }),
    toggleAllItems: () =>
      set((state) => {
        const { items } = state;
        const isAllUnselected = items.every((item) => item.isSelected === false);
        const newItems = items.map((item) => ({
          ...item,
          isSelected: isAllUnselected,
        }));
        return { items: newItems };
      }),
  }))
);

useSelectItemsStore.subscribe((state) => state.items, console.log);

export const useSelectableItems = ({ initialItems, identifierKey = 'id' }) => {
  const { initItems, toggleItem, items, toggleAllItems, setIdentifierKey } = useSelectItemsStore((state) => ({
    initItems: state.initItems,
    toggleItem: state.toggleItem,
    items: state.items,
    toggleAllItems: state.toggleAllItems,
    setIdentifierKey: state.setIdentifierKey,
  }));

  //initial items and set isSelected property to anyone
  useEffect(() => {
    const shouldInitializeItems = (initialItems ?? []).length > 0;
    // const hasItems = items.length > 0;
    if (!shouldInitializeItems) {
      return;
    }
    setIdentifierKey(identifierKey);
    initItems(initialItems);
  }, [initialItems]);

  // toggle select single item handler
  const toggleSelectItem = useCallback(
    (item) => {
      toggleItem(item[identifierKey]);
    },
    [identifierKey]
  );

  //toggle select all items handler
  const toggleSelectAllItems = useCallback(() => {
    toggleAllItems();
  }, []);

  //selected items Array
  const selectedItems = useMemo(
    () =>
      items
        .filter((item) => item.isSelected)
        .map(({ isSelected: _isSelected, ...rest }) => ({
          ...rest,
        })),
    [items]
  );

  //is All Items Selected
  const isAllSelected = useMemo(() => selectedItems.length === items.length, [selectedItems, items]);

  const result = useMemo(
    () => ({
      items,
      selectedItems,
      toggleSelectAllItems,
      toggleSelectItem,
      isAllSelected,
    }),
    [items, selectedItems, toggleSelectAllItems, toggleSelectItem, isAllSelected]
  );

  return result;
};
