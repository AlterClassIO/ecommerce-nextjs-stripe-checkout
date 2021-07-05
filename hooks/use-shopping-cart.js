import React, { useContext, useReducer, useMemo } from 'react';

// Reducers
const initialCartValues = {
  cartDetails: {},
  cartCount: 0,
  totalPrice: 0,
};

const cartReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_ITEM':
      if (action?.count <= 0) break;
      return {
        ...state,
        cartDetails: {
          ...state.cartDetails,
          [action.product.id]: action.product,
        },
        totalPrice: state.totalPrice + action.product.price * action.count,
        cartCount: state.cartCount + action.count,
      };
    case 'REMOVE_ITEM':
    default:
      return state;
  }
};

// Context + Provider
const CartContext = React.createContext();

export const CartProvider = ({ currency = 'USD', children = null }) => {
  const [cart, dispatch] = useReducer(cartReducer, initialCartValues);

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

  const shoppingCart = {
    ...cart,
    addItem,
  };

  return shoppingCart;
};
