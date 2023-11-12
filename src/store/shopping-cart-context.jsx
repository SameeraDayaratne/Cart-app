import { createContext } from 'react'
import { DUMMY_PRODUCTS } from '../dummy-products';
import { useReducer } from 'react';
import React from 'react';

export const CartContext = createContext({
    items:[],
    addItemToCart:() => {},
    handleCartItems:()=> {}
});

function shoppingCartReducer(state,action){

    if(action.type == 'add')
    {
        const updatedItems = [...state.items];
    
        const existingCartItemIndex = updatedItems.findIndex(
          (cartItem) => cartItem.id === action.payload
        );
        const existingCartItem = updatedItems[existingCartItemIndex];
  
        if (existingCartItem) {
          const updatedItem = {
            ...existingCartItem,
            quantity: existingCartItem.quantity + 1,
          };
          updatedItems[existingCartItemIndex] = updatedItem;
        } else {
          const product = DUMMY_PRODUCTS.find((product) => product.id === action.payload);
          updatedItems.push({
            id: action.payload,
            name: product.title,
            price: product.price,
            quantity: 1,
          });
        }
  
        return {
          items: updatedItems,
        };
    }

    if(action.type == 'update')
    {
      const updatedItems = [...state.items];
      const updatedItemIndex = updatedItems.findIndex(
        (item) => item.id === action.payload.productId
      );

      const updatedItem = {
        ...updatedItems[updatedItemIndex],
      };

      updatedItem.quantity += action.payload.amount;

      if (updatedItem.quantity <= 0) {
        updatedItems.splice(updatedItemIndex, 1);
      } else {
        updatedItems[updatedItemIndex] = updatedItem;
      }

      return {
        items: updatedItems,
      };
    }

}

export default function cartContextProvider({children})
{
    const [shoppingCartState, ShoppingCartDispatch] = useReducer(shoppingCartReducer,{
        items: [],
      })


    
      function handleAddItemToCart(id) {
        ShoppingCartDispatch({
          type:'add',
          payload:id
        });
      }
    
      function handleUpdateCartItemQuantity(productId, amount) {
        ShoppingCartDispatch({
          type:'update',
          payload:{
            productId,
            amount
          }
        });
      }
    
      const cartCtx = {
        items:shoppingCartState.items,
        addItemToCart:handleAddItemToCart,
        handleCartItems : handleUpdateCartItemQuantity
      };

      return (<CartContext.Provider value={cartCtx}>{children} </CartContext.Provider>);
            
       

}
