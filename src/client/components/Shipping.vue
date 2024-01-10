<script setup lang="ts">
import { ref, onMounted, type Ref } from "vue"

import { type shipping_t } from "../controller/order"
import { userInfo } from "../model/global_state";
import { alterState, getRate, giveRate } from "../controller/order"

const props = defineProps<{
  value: shipping_t
}>()

const shipping = props.value

const shippingStatusRecord: Record<number, string> = {
  0: "送出訂單",
  1: "商家收到訂單",
  2: "出貨",
  3: "商品已送達",
  4: "成功收貨"
}

const rate: Ref<number | undefined> = ref();
const newRate: Ref<number> = ref(0);

async function submitNewRate(shipping_id: number, rate: number) {
  if (rate > 5 || rate < 1) {
    alert("rate must in range 1 - 5")
    return
  }
  await giveRate(shipping_id, rate as 1 | 2 | 3 | 4 | 5)
}

onMounted(async () => {
  const rateResult = await getRate(shipping.id)
  if (rateResult === undefined) {
    rate.value = undefined
  } else {
    rate.value = rateResult?.rate
  }
})

</script>

<template>
  <section>
    <div>Shipping Id: {{ shipping.id }}</div>

    <table>
      <tr>
        <td>Item id:</td>
        <td>{{ shipping.item_id }}</td>
      </tr>

      <tr>
        <td>Name:</td>
        <td>{{ shipping.item_name }}</td>
      </tr>

      <tr>
        <td>Price:</td>
        <td>{{ shipping.item_price }}</td>
      </tr>

      <tr>
        <td>Quantity:</td>
        <td>{{ shipping.quantity }}</td>
      </tr>

      <tr>
        <td>Seller ID:</td>
        <td>{{ shipping.seller_id }}</td>
      </tr>

      <tr>
        <td>Ship status:</td>
        <td>{{ shippingStatusRecord[shipping.ship_status] }}</td>

        <button v-if="userInfo?.role.seller" :disabled="shipping.ship_status != 0"
          @click="alterState(shipping.id, 1)">確認訂單</button>
        <button v-if="userInfo?.role.seller" :disabled="shipping.ship_status != 1"
          @click="alterState(shipping.id, 2)">可以出貨</button>
        <button v-if="userInfo?.role.shipper" :disabled="shipping.ship_status != 2"
          @click="alterState(shipping.id, 3)">送達客人地址</button>
        <button v-if="userInfo?.role.seller === false && userInfo?.role.shipper === false"
          :disabled="shipping.ship_status !== 3" @click="alterState(shipping.id, 4)">取貨確認</button>
      </tr>


      <template
        v-if="(userInfo?.role.seller === false && userInfo?.role.shipper === false) && shipping.ship_status === 4">
        <tr>
          <td>Rate: </td>
          <td>
            <template v-if="rate !== undefined">
              {{ rate }} / 5
            </template>
            <template v-else>
              <select v-model="newRate">
                <option disabled value="">請評分 1-5</option>
                <option>5</option>
                <option>4</option>
                <option>2</option>
                <option>3</option>
                <option>1</option>
              </select>
              <button :disabled="newRate === 0" @click="submitNewRate(shipping.id, newRate)">提交評分</button>

            </template>

          </td>
        </tr>
      </template>



    </table>

  </section>
</template>

<style scoped>
section {
  border: 1px solid grey;
  margin-top: 2rem;
  margin-bottom: 2rem;
  padding: 1rem;
}
</style>