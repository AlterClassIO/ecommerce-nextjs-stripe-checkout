import React, { useContext, useReducer, useMemo } from 'react';
import useLocalStorageReducer from './use-local-storage-reducer';

// Reducers
const initialCartValues = {
  cartDetails: {},
  cartCount: 0,
  totalPrice: 0,
};

const addItem = (state = {}, product = null, count = 0) => {
  if (count <= 0 || !product) return state;

  let entry = state?.cartDetails?.[product.sku];

  // Update item
  if (entry) {
    entry.count += count;
  }
  // Add item
  else {
    entry = {
      ...product,
      count,
    };
  }

  return {
    ...state,
    cartDetails: {
      ...state.cartDetails,
      [product.sku]: entry,
    },
    cartCount: Math.max(0, state.cartCount + count),
    totalPrice: Math.max(state.totalPrice + product.price * count),
  };
};

const removeItem = (state = {}, product = null, count = 0) => {
  if (count <= 0 || !product) return state;

  let entry = state?.cartDetails?.[product.sku];

  if (entry) {
    // Remove item
    if (count >= entry.count) {
      const { [product.sku]: sku, ...details } = state.cartDetails;
      return {
        ...state,
        cartDetails: details,
        cartCount: Math.max(0, state.cartCount - entry.count),
        totalPrice: Math.max(0, state.totalPrice - product.price * entry.count),
      };
    }
    // Update item
    else {
      return {
        ...state,
        cartDetails: {
          ...state.cartDetails,
          [product.sku]: {
            ...entry,
            count: entry.count - count,
          },
        },
        cartCount: Math.max(0, state.cartCount - count),
        totalPrice: Math.max(0, state.totalPrice - product.price * count),
      };
    }
  } else {
    return state;
  }
};

const clearCart = () => {
  return initialCartValues;
};

const cartReducer = (state = {}, action) => {
  switch (action.type) {
    case 'ADD_ITEM':
      return addItem(state, action.product, action.count);
    case 'REMOVE_ITEM':
      return removeItem(state, action.product, action.count);
    case 'CLEAR_CART':
      return clearCart();
    default:
      return state;
  }
};

// Context + Provider
const CartContext = React.createContext();

export const CartProvider = ({ currency = 'USD', children = null }) => {
  const [cart, dispatch] = useLocalStorageReducer(
    'cart',
    cartReducer,
    initialCartValues
  );

  const contextValue = useMemo(
    () => [
      {
        ...cart,
        currency,
      },
      dispatch,
    ],
    [cart, currency]
  );

  return (
    <CartContext.Provider value={contextValue}>{children}</CartContext.Provider>
  );
};

// Hook
export const useShoppingCart = () => {
  const [cart, dispatch] = useContext(CartContext);

  const addItem = (product, count = 1) =>
    dispatch({ type: 'ADD_ITEM', product, count });

  const removeItem = (product, count = 1) =>
    dispatch({ type: 'REMOVE_ITEM', product, count });

  const clearCart = () => dispatch({ type: 'CLEAR_CART' });

  const shoppingCart = {
    ...cart,
    addItem,
    removeItem,
    clearCart,
  };

  return shoppingCart;
};
