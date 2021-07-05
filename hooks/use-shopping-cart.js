import React, { useContext, useReducer, useMemo } from 'react';
import useLocalStorageReducer from './use-local-storage-reducer';

// Reducers
const initialCartValues = {
  cartDetails: {},
  cartCount: 0,
  totalPrice: 0,
};

const addItem = (state = {}, product = null, quantity = 0) => {
  if (quantity <= 0 || !product) return state;

  let entry = state?.cartDetails?.[product.id];

  // Update item
  if (entry) {
    entry.quantity += quantity;
  }
  // Add item
  else {
    entry = {
      ...product,
      quantity,
    };
  }

  return {
    ...state,
    cartDetails: {
      ...state.cartDetails,
      [product.id]: entry,
    },
    cartCount: Math.max(0, state.cartCount + quantity),
    totalPrice: Math.max(state.totalPrice + product.price * quantity),
  };
};

const removeItem = (state = {}, product = null, quantity = 0) => {
  if (quantity <= 0 || !product) return state;

  let entry = state?.cartDetails?.[product.id];

  if (entry) {
    // Remove item
    if (quantity >= entry.quantity) {
      const { [product.id]: id, ...details } = state.cartDetails;
      return {
        ...state,
        cartDetails: details,
        cartCount: Math.max(0, state.cartCount - entry.quantity),
        totalPrice: Math.max(
          0,
          state.totalPrice - product.price * entry.quantity
        ),
      };
    }
    // Update item
    else {
      return {
        ...state,
        cartDetails: {
          ...state.cartDetails,
          [product.id]: {
            ...entry,
            quantity: entry.quantity - quantity,
          },
        },
        cartCount: Math.max(0, state.cartCount - quantity),
        totalPrice: Math.max(0, state.totalPrice - product.price * quantity),
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
      return addItem(state, action.product, action.quantity);
    case 'REMOVE_ITEM':
      return removeItem(state, action.product, action.quantity);
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

  const addItem = (product, quantity = 1) =>
    dispatch({ type: 'ADD_ITEM', product, quantity });

  const removeItem = (product, quantity = 1) =>
    dispatch({ type: 'REMOVE_ITEM', product, quantity });

  const clearCart = () => dispatch({ type: 'CLEAR_CART' });

  const shoppingCart = {
    ...cart,
    addItem,
    removeItem,
    clearCart,
  };

  return shoppingCart;
};
