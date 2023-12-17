# TypeScript 速成 <!-- omit in toc -->

TypeScript 是 JavaScript + Types, 因此本速成會預設您瞭解 JavaScript 語法.

TypeScript **不會** 在執行過程檢查形態! 這只是讓利你程式邏輯不會寫錯而已. 如果要真正的檢查, 還是需要自己寫一隻函式.

本章節會快速教您如何使用 TypeScript 功能.

## 目錄 <!-- omit in toc -->
- [資料形態](#資料形態)
  - [通用型資料形態](#通用型資料形態)
  - [自定義形態](#自定義形態)
- [TypeScript 特殊形態 (Util Type)](#typescript-特殊形態-util-type)
- [應用範例](#應用範例)
  - [處理API回應](#處理api回應)
  - [過濾陣列](#過濾陣列)


## 資料形態

定義變數資料形態方式為 `變數: 形態`. 在不加任何定義時, 變數形態是 `any (任何東西)`.

除非特殊原因, 一般情況盡可能避免 `any`, 請給它不上一個資料形態.

```ts
let foo;                          // 資料形態: any (盡量避免)
let bar: number;                  // 資料形態: 數字
let baz: string[];                // 資料形態: 字串陣列
let qux: number | string;         // 資料形態: 數字 或者 字串

let ham: HTMLElement | undefined; // 資料形態: 網頁DOM 或者 未被定義(沒找到)

let a = "Happy";                  // 資料形態: 字串
```
### 通用型資料形態

通常會出現在資料結果裏面, 其表示方式為 `結構<形態>`.

```ts
let foo: Array<string>;       // 資料形態: 字串陣列 (陣列可以用這種方式定義)
let bar: Map<string, number>; // 資料形態: 字典, key形態為字串, value形態為數字
let baz: Promise<Response>;   // 資料形態: 一個非同步物件, 當其成功結束時, 會回傳 Response 物件
let qux: Ref<number[]>;       // 資料形態: Vue ref, 裏面内容數為數字陣列

let ham = [420, "ham"];       // 資料形態: 字串和數字陣列
```

### 自定義形態

JavaScript 沒有真正的物件導向, 内建的 `class` 只是方便你建立一個物件.

加上處理 `.json()` 也不可能把所有形態都寫成 `class`, 其也只是硬生生轉換成物件而已.

因此直接定義一個形態更方便. 定義形態使用 `type`.

```ts
type any = {} // TypeScript 自帶的 any 就是等於一個物件. (這是演示, 請不要在程式裏面定義 any!)

type price = number; // 價格 形態是一個 數字
type school = string; // 學校 形態是一個 字串

type scooter = { // 機車 形態是一個 物件
  model: string; // 型號 形態是一個 字串
  plate: string; // 車牌 形態是一個 字串
}

type student = { // 學生 形態是一個 物件
  name: string // 名字 形態是一個 字串
  credit: number, // 學分 形態是一個 數字
  scooters?: scooter[]; // 擁有機車 形態是一個 機車(物件)陣列, 但可能沒有
}

type successResponse = { // 成功回應裏面會有一個欄位
  status: "SUCCESS";     // 狀態 欄位會寫 "SUCCESS"
}

type failResponse = { // 失敗回應裏面會有兩個欄位.
  status: "FAIL";     // 狀態 欄位會寫 "FAIL"
  reason: string;     // 原因 欄位會是 字串.
}

type apiResponse = successResponse | failResponse; // API 回應有可能是成功, 也可能是失敗. 成功或失敗結果可以看上面
```

## TypeScript 特殊形態 (Util Type)

以下是 TypeScript 自帶的特殊形態, 這些形態是幫你創造形態.

有很多内建形態, 這件只講在程式可能會見到的. 詳細可以去[官方説明文檔](https://www.typescriptlang.org/docs/handbook/utility-types.html)查看.

```ts
type subject_result = {
  course_id: number;
  teacher: string;
  score: number;
  is_fail: bool;
}

// Pick: 建立一個新資料形態, 其建基於其他形態, 只要那個形態裏面某些元素.
type subject_score = Pick<subject_result, "course_id" | "score">;
// {
//   course_id: number;
//   score: number;
// }

// Omit: 建立一個新資料形態, 其建基於其他形態, 但缺少某些元素.
type subject_teacher = Omit<subject_result, "score" | "is_fail">;
// {
//   course_id: number;
//   teacher: string;
// }

// 形態也是可以用 & 粘起來.
type subject_result_new = subject_teacher & subject_score;
// {
//   course_id: number;
//   teacher: string;
//   score: number;
// }
```

## 應用範例

### 處理API回應

```ts
type SuccessResponse = {
  id: number;
  title: string;
  description: string;
  price: number;
}

type FailResponse = {
  message: string;
}

type APIResponse = SuccessResponse | FailResponse;

const API_URI = "https://dummyjson.com/products/" // 借用別人的 API, 他們是透過 HTTP status code 判斷成功失敗.

async function getProduct(id: number): Promise<SuccessResponse> {
  const resp = await fetch(`${API_URI}${id}`);
  const respJson: APIResponse = await resp.json();
  if (resp.status >= 400) {
    // as 是 TypeScript 的語法, 告訴 TypeScript 請你假設 any 是某個形態.
    throw new Error((respJson as FailResponse).message);
  }

  return respJson as SuccessResponse;
}

async function printResult(id: number) {
  const respJson = await getProduct(id);
  console.log(respJson)
}
```

### 過濾陣列

```ts
type Success = {
  status: "SUCCESS";
  content: string;
}

type Fail = {
  status: "FAIL";
  reason: string;
}

type Reply = Success | Fail;

const foo: Array<Reply> = [
  { status: "SUCCESS", content: "foo" },
  { status: "FAIL", reason: "N/A" },
  { status: "SUCCESS", content: "bar" }
];

const successResult = foo.filter((value) => value.status === "SUCCESS") as Success[];

const failResult = foo.filter(function (value: Reply) {
  return value.status === "FAIL";
}) as Array<Fail>;
```