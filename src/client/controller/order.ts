import { session, userId } from "../model/global_state";

export type shipping_t = {
  id: number;
  seller_id: number;
  item_id: number;
  item_name: string;
  item_price: number;
  item_description: string | null;
  quantity: number;
  ship_status: 0 | 1 | 2 | 3;
};

export type shopping_t = {
  id: number;
  user_id: number;
};

export type shopping_order_t = Pick<shopping_t, "id"> & {
  shipping: shipping_t[];
};

//取得所有結帳記錄
export const getAllShoppingOrder = async () => {
  try {
    const response = await fetch(`${window.location.origin}/api/shopping/all`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: userId.value,
        session: session.value,
      }),
    });
    if (response.ok) {
      const data = await response.json();
      if (data.type === "shopping_record_all") {
        const recordList: shopping_order_t[] = data.content;
        console.log("record List:", recordList);
        return recordList;
      } else {
        console.error("Unexpected response type:", data.type);
      }
    } else {
      console.error("Failed to fetch record List:", response.statusText);
    }
  } catch (error) {
    console.error("Error during fetch:", error);
  }
};
// 取讀某一次結帳記錄
export const getShoppingOrder = async (orderId: number) => {
  try {
    const response = await fetch(`${window.location.origin}/api/shopping/get`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: userId.value,
        session: session.value,
        order_id: orderId,
      }),
    });

    if (response.ok) {
      const data = await response.json();
      if (data.type === "shopping_record_all") {
        const recordList: shopping_order_t = data.content;
        console.log("record List:", recordList);
        return recordList;
      } else {
        console.error("Unexpected response type:", data.type);
      }
    } else {
      console.error("Failed to fetch record List:", response.statusText);
    }
  } catch (error) {
    console.error("Error during fetch:", error);
  }
};

// 取得所有商品運輸記錄
export const getAllShippingOrder = async () => {
  console.log(`${userId.value}, ${session.value}`);
  try {
    const response = await fetch(`${window.location.origin}/api/shipping/all`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: userId.value,
        session: session.value,
      }),
    });

    if (response.ok) {
      const data = await response.json();

      // 處理成功獲取的運輸單數據
      if (data.type === "shipment_all") {
        const shipmentList: shipping_t[] = data.content;
        console.log("Shipment List:", shipmentList);
        return shipmentList;
      } else {
        console.error("Unexpected response type:", data.type);
      }
    } else {
      console.error("Failed to fetch shipment list:", response.statusText);
    }
  } catch (error) {
    console.error("Error during fetch:", error);
  }
};

// 取得指定運輸記錄
export const getShippingOrder = async (shippingOrder: number) => {
  try {
    const response = await fetch(`${window.location.origin}/api/shipping/get`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: userId.value,
        shipping_order: shippingOrder,
      }),
    });

    if (response.ok) {
      const data = await response.json();

      if (data.type === "shipment") {
        console.log("Shipment:", data.content);
        return data.content as shipping_t;
      } else {
        console.error("Unexpected response type:", data.type);
      }
    } else if (response.status === 400) {
      console.error("General Error:", await response.text());
    } else if (response.status === 403) {
      console.error("Authentication Failed");
    } else {
      console.error("Failed to fetch shipment:", response.statusText);
    }
  } catch (error) {
    console.error("Error during shipment fetch:", error);
  }
};

// // 改狀態
export const alterState = async (shippingOrder: number, state: 1 | 2 | 3) => {
  try {
    const response = await fetch(
      `${window.location.origin}/api/shipping/alter`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: userId.value,
          session: session.value,
          shipping_order: shippingOrder,
          state: state,
        }),
      },
    );

    if (response.ok) {
      console.log("alter successful");
      return true;
    } else {
      console.error("Failed to alter:", response.statusText);
    }
  } catch (error) {
    console.error("Error during alter:", error);
  }

  return false;
};

export type shipping_rate_t = {
  shipping_id: number;
  rate: 1 | 2 | 3 | 4 | 5;
};

// 評分
export const giveRate = async (
  shippingOrder: number,
  rate: 1 | 2 | 3 | 4 | 5,
) => {
  try {
    const response = await fetch(
      `${window.location.origin}/api/shipping/rate`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: userId.value,
          session: session.value,
          shipping_order: shippingOrder,
          rate: rate,
        }),
      },
    );

    if (response.ok) {
      console.log("rate successful");
      return true;
    } else {
      console.error("Failed to rate:", response.statusText);
    }
  } catch (error) {
    console.error("Error during rate:", error);
  }

  return false;
};

//看評分
export const getRate = async (shippingOrder: number) => {
  try {
    const response = await fetch(
      `${window.location.origin}/api/shipping/rate_get`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: userId.value,
          session: session.value,
          shipping_order: shippingOrder,
        }),
      },
    );

    if (response.ok) {
      const data = await response.json();

      if (data.type === "shipping_rate") {
        console.log("shipping_rate:", data.content);
        return data.content as shipping_rate_t;
      } else {
        console.error("Unexpected response type:", data.type);
      }
    } else if (response.status === 404) {
      console.log(`cannot find shipping: ${shippingOrder} rate.`);
      return undefined;
    } else {
      console.error("Failed to get rate:", response.statusText);
    }
  } catch (error) {
    console.error("Error during get rate:", error);
  }
};
