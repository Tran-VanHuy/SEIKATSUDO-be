export const constants = {
  ROUTER: {
    ADMIN: 'admin',
    USER: 'user',
  },
  PAYMENT_STATUS: {
    PAID: 1,
    UN_PAID: 0,
  },
  SALE: {
    TAKE_ONE: 1,
    LIMIT_OFFSET: 2,
    TAKE_THREE: 3,
  },
  STATUS_ERROR: {
    VALUE: 500,
  },
  PAYMENT_TYPE: {
    GET_ALL: '0',
  },
};

export const firstRevenueId = 'r0000000000000001';
export const FIRST_SHIPPING_COMPANY_ID = '00001';
export const FIRST_PAYMENT_METHOD_ID = '00001';
export const DEFAULT_PAYMENT_METHOD = '00003';
export const PRODUCT_CATEGORY = [
  {
    FIRST_PRODUCT_CATEGORY_ONE: '1001',
    TYPE: 1,
    MAX: '1999',
    NAME: '区分1',
  },
  {
    FIRST_PRODUCT_CATEGORY_TWO: '2001',
    TYPE: 2,
    MAX: '2999',
    NAME: '区分2',
  },
  {
    FIRST_PRODUCT_CATEGORY_THREE: '3001',
    MAX: '3999',
    TYPE: 3,
    NAME: '区分3',
  },
  {
    FIRST_PRODUCT_CATEGORY_FOUR: '4001',
    MAX: '4999',
    TYPE: 4,
    NAME: '区分4',
  },
  {
    FIRST_PRODUCT_CATEGORY_FIVE: '5001',
    MAX: '5999',
    TYPE: 5,
    NAME: '区分5',
  },
  {
    ID_NA: 'NA',
  },
];

export const BAD_REQUEST_STATUS = 400;
export const MSG = {
  SEARCH_FAIL: 'の検索に失敗しました。',
  CREATE_FAIL: 'の新規作成に失敗しました。',
  UPDATE_FAIL: 'の更新に失敗しました。',
  GET_FAIL: '情報の取得に失敗しました。',
  DELETE_FAIL: 'の削除に失敗しました。',
  SALE: '売上伝票',
  MAX_LENGTH_255: '255文字まで入力してください',
  PASSWORD: 'パスワードは半角英数で8 文字以上、255 文字以内にしてください',
  KATAKANA: '255文字までカタカナを入力してください',
  CONFIRM_PASSWORD: 'パスワードと一致しません',
  START_END_DATE: '入社年月日の後で入力してください',
  DUPLICATE_STAFF: '担当者コードはすでに使用されています。',
  STAFF: '担当者',
  OVER_40_CHARACTERS: '40文字まで入力してください',
  ERROR_UNIQUE: '配送業者名は既に使っています',
  AREA_SHIPMENT: '発送日',
  EMPTY: '配送業者名を入力してください',
  PAYMENT_METHOD: '支払方法',
  PAYMENT_METHOD_BE_USE: '選択支払方法は売上伝票を利用しているので削除できません。',
  DUPLICATE_PAYMENT_METHOD: '支払方法名は既に使っている',
  DUPLICATE_CHILD_SETTING_CUSTOMER: '顧客区分名はすでに利用しています',
  DUPLICATE_PARENT_SETTING_CUSTOMER: '分類名はすでに利用しています',
  MAX_PARENT_SETTING_CUSTOMER: '最大20区分まで作成できます',
  SETTING_CUSTOMER: '顧客区分',
  SETTING_CUSTOMER_BE_USE: 'を利用しているので削除できません',
  SETTING_CUSTOMER_DEFAULT: '未設定',
  DUPLICATE_WITH_SETTING_CUSTOMER_DEFAULT: '分類名を入力してください',
  SALE_IS_NOT_ORDER_CONFIRMED_STATUS: 'の伝票状態は「受注確認済」ではありませんので出荷指示できません。',
  SALE_IS_NOT_SHIPPING_PREPARE_STATUS: '伝票状態は「出荷指示済」ではありませんのでCSV出力できません。',
  SALE_IS_NOT_SHIPPED_STATUS: 'の伝票状態は「受注確認済」ですので印刷できません。',
  SALE_CAN_NOT_CANCEL: '入金額がありましたのでキャンセルできません。',
  SALE_HAVE: '伝票は先ほど',
  BE_CHANGE: 'に変更されましたので編集できません。',
  PRODUCT_IS_DISABLE: 'の商品は無効です。',
  PRODUCT_UNIQUE: 'このコードは既に利用していますので他のコードを入力してください。',
  LOGIN_FAILED: 'ログインに失敗しました',
};

export const REGEX = {
  KANA_MAX_LENGTH_255: /^([ｧ-ﾝﾞﾟァ-ン|ー]){0,255}$/,
  PASSWORD_RULE: /^[0-9a-zA-Z]{8,12}$/,
};

export const NEXT_ONE_YEAR = 1;
export const IS_UPDATE_SETTING_CUSTOMER = 1;

export const STATUS_SALE_VALUE = {
  ORDERED: 1,
  ORDER_CONFIRMED: 2,
  SHIPPING_PREPARE: 3,
  SHIPPED: 4,
  PAYMENT_DONE: 5,
  REMOVE_PAYMENT: 6,
  CANCEL: 99,
};

export const STATUS_OPTION = [
  { label: '受注済', value: 1 },
  { label: '受注確認済', value: 2 },
  { label: '出荷指示済', value: 3 },
  { label: '出荷済', value: 4 },
  { label: '回収済', value: 5 },
  { label: '債権放棄', value: 6 },
  { label: 'キャンセル', value: 99 },
];

export const STAFF_IS_DISABLED = 1;
export const SHIPPING_COMPANY_DEFAULT = ['00007', '00008'];
export const SHIPPING_COMPANY_AFTER_DEFAULT = '00009';
export const FIRST_STAFF_CODE = '00001';
export const TRANSFER = '00001';
export const firstCustomerId = '00000001';
export const FIRST_PAYMENT = 1;

export const SHIPMENT_TIME_OPTION = [
  { label: '01', value: 1, titleCSV: '00' },
  { label: '02', value: 2, titleCSV: '51' },
  { label: '03', value: 3, titleCSV: '52' },
  { label: '04', value: 4, titleCSV: '53' },
  { label: '05', value: 5, titleCSV: '54' },
  { label: '06', value: 6, titleCSV: '55' },
  { label: '07', value: 7, titleCSV: '56' },
];
