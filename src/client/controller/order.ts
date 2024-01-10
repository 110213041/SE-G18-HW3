import { username, password, email, userId, session, userInfo} from "../model/global_state";
import { handleLogout} from "../model/global_state";
import { useRouter } from 'vue-router';
import { orderId } from "./cart_new";
// import { State} from "../view/shipperHome.vue";
// import { rate } from "../view/clientHome.vue";
//取得所有結帳記錄
export const getAllShoppingOrder = async () => {
  try {
    const response = await fetch(`${window.location.origin}/api/shopping/all`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        id: userId.value,
        session:session.value,
      }),
    });
    if (response.ok) {
      const data = await response.json();
      if (data.type === "shopping_record_all") {
        const recordList = data.content;
        console.log("record List:", recordList);
      } else {
        console.error("Unexpected response type:", data.type);
      }
    } else {
      console.error("Failed to fetch record List:", response.statusText);
    }
  } catch (error) {
    console.error("Error during fetch:", error);
  }
}
// 取讀某一次結帳記錄
export const getShoppingOrder = async () => {
  try {
    const response = await fetch(`${window.location.origin}/api/shopping/get`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        id: userId.value,
        session:session.value,
        order_id:orderId.value,
      }),
    });

    if (response.ok) {
      const data = await response.json();
      if (data.type === "shopping_record_all") {
        const recordList = data.content;
        console.log("record List:", recordList);
      } else {
        console.error("Unexpected response type:", data.type);
      }
    } else {
      console.error("Failed to fetch record List:", response.statusText);
    }
  } catch (error) {
    console.error("Error during fetch:", error);
  }
}

// 取得所有商品運輸記錄
export const getAllShippingOrder = async () => {
  console.log(`${userId.value}, ${session.value}`)
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
      const shipmentList = data.content;
      console.log("Shipment List:", shipmentList);
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
export const getShippingOrder = async () => {
  try {
    const response = await fetch(`${window.location.origin}/api/shipping/get`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        id: userId.value,
        shipping_order:orderId.value,
      }),
    });
  
    if (response.ok) {
      const data = await response.json();
  
      if (data.type === 'shipment') {
        console.log('Shipment:', data.content);
      } else {
        console.error('Unexpected response type:', data.type);
      }
    } else if (response.status === 400) {
      console.error('General Error:', await response.text());
    } else if (response.status === 403) {
      console.error('Authentication Failed');
    } else {
      console.error("Failed to fetch shipment:", response.statusText);
    }
  } catch (error) {
    console.error("Error during shipment fetch:", error);
  }
}

// // 改狀態
// export const altterState = async () => {
//   try {
//     const response = await fetch(`${window.location.origin}/api/shipping/alter`, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json"
//       },
//       body: JSON.stringify({
//         id: userId.value,
//         session:session.value,
//         shipping_order:orderId.value,
//         state:State.value,
//       }),
//     });
    
//     if (response.ok) {
//       // const data = await response.json();
//       console.log('alter successful');
//     } else {
//       console.error("Failed to alter:", response.statusText);
//     }
//   } catch (error) {
//     console.error("Error during alter:", error);
  
//   }
// }

// // 評分
// export const giveRate = async () => {
//   try {
//     const response = await fetch(`${window.location.origin}/api/shipping/get`, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json"
//       },
//       body: JSON.stringify({
//         id: userId.value,
//         session: session.value,
//         shipping_order: orderId.value,
//         rate: rate.value,
//       }),
//     });

//     if (response.ok) {
//       // const data = await response.json();
//       console.log('rate successful');
//     } else {
//       console.error("Failed to rate:", response.statusText);
//     }
//   } catch (error) {
//     console.error("Error during rate:", error);
//   }
  
// }

// //看評分
// export const getRate = async () => {
//   try {
//     const response = await fetch(`${window.location.origin}/api/shipping/get`, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json"
//       },
//       body: JSON.stringify({
//         id: userId.value,
//         session: session.value,
//         shipping_order: orderId.value,
//         rate: rate.value,
//       }),
//     });

//     if (response.ok) {
//       const data = await response.json();
  
//       if (data.type === 'shipping_rate') {
//         console.log('shipping_rate:', data.content);
//       } else {
//         console.error('Unexpected response type:', data.type);
//       }
//     } else {
//       console.error("Failed to get rate:", response.statusText);
//     }
//   } catch (error) {
//     console.error("Error during get rate:", error);
//   }
// }



