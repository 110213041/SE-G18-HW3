import { ref, onMounted } from 'vue';
import { username, password, email, userId, session, userInfo} from "../model/global_state";

export type requestInfo = {
  itemId: number,
  quantity: number,
  attribute,
  value,
};


  // Get one item info
export const getItemInfo = async(itemId:requestInfo) => {
    try {
      const response = await fetch(`${window.location.origin}/api/items/get`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: userId,
          session: session,
          item_id: itemId,
        }),
      });
  
      if (!response.ok) {
        throw new Error(`Failed to get item info: ${response.statusText}`);
      }
  
      const data = await response.json();
      if (data.type === 'items') {
        const itemInfo = data.content;
        console.log('Item Info:', itemInfo);
      } else {
        throw new Error(`Unexpected response type: ${data.type}`);
      }
    } catch (error) {
      console.error('Error during getItemInfo:', error);
    }
  }
  
  // Get all items
export const getAllItems= async() => {
    try {
      const response = await fetch(`${window.location.origin}/api/items/all`, {
        method: 'GET',
      });
  
      if (!response.ok) {
        throw new Error(`Failed to get all items: ${response.statusText}`);
      }
  
      const data = await response.json();
      if (data.type === 'items_all') {
        const allItems = data.content;
        console.log('All Items:', allItems);
      } else {
        throw new Error(`Unexpected response type: ${data.type}`);
      }
    } catch (error) {
      console.error('Error during getAllItems:', error);
    }
  }
  
  // Modify item status
export const modifyItemStatus = async(itemId:requestInfo, attribute, value) => {
    try {
      const response = await fetch(`${window.location.origin}/api/items/alter`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: userId,
          session: session,
          item_id: itemId,
          attribute: attribute,
          value: value,
        }),
      });
  
      if (!response.ok) {
        throw new Error(`Failed to modify item status: ${response.statusText}`);
      }
  
      console.log('Item status modified successfully');
    } catch (error) {
      console.error('Error modify ItemS tatus:', error);
    }
  }
  
  // Create item
export const createItem= async(itemName, itemPrice, itemDescription) => { 
  try {
    const response = await fetch(`${window.location.origin}/api/items/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        user_id: userId,
        session: session,
        item_name: itemName,
        item_price: itemPrice,
        item_description: itemDescription,
      }),
    });
  
    if (!response.ok) {
      throw new Error(`Failed to create item: ${response.statusText}`);
    }
  
    const data = await response.json();
    if (data.type === 'item_create') {
      const createdItem = data.content;
      console.log('Item created successfully:', createdItem);
    } else {
      throw new Error(`Unexpected response type: ${data.type}`);
    }
    } catch (error) {
      console.error('Error create Item:', error);
    }
  }
  
  