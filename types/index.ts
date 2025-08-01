export interface loginType {
  email: string;
  password: string;
}
export interface registerType {
  name: string;
  email: string;
  password: string;
  confirm_password?: string;
}

export interface UserType {
  createdAt: string;
  email: string;
  emailVerified: string | null;
  id: number;
  image: string | null;
  name: string;
  role: string;
  uid: string;
  updatedAt: string;
}
export interface ChatSelectType {
  id: number;
  uid: string;
  name: string;
  messages: Message[];
  createdAt: string;
  updatedAt: string;
  user: User;
}

export interface Message {
  id: number;
  content: string;
  createdAt: string;
  sender: string;
}

export interface User {
  id: number;
  uid: string;
  name: string;
  email: string;
  emailVerified: string | null;
  image: string | null;
  password: string;
  role: string;
  createdAt: string;
  updatedAt: string;
}

export type deleteValuesType = {
  email: string;
  code: string;
  newPassword: string;
  newPasswordCon?: string;
};
export type detectedTy = {
  product_type: string;
  products: ProductType[];
};
type Sender = {
  id: number | null;
  name: string; 
};
type Key = {
  id: number;
  key: string;
};

export type ColorOption = {
  id: number;
  name: string;
  hexCode: string;
  url: string | null;
  keys: Key;
};
export type ChatMessageType = {
  id: number;
  content: string;
  createdAt: string;
  imageUrl: string | null;
  sender: Sender;
  type:
    | "text"
    | "image"
    | "products"
    | "items"
    | "SearchedProductsByImage"
    | "room_analysis";
  description?: string;
  options: ColorOption[];
};

export type JoinChatResponseType = {
  success: boolean;
  message: string;
  chatId: number;
  chatUid: string;
  chatName: string;
  messages: ChatMessageType[];
};

// card ai
interface ProductKey {
  id: number;
  value: string;
  createdAt: string;
  updatedAt: string;
}

interface ProductAttribute {
  id: number;
  value: string;
  image: string | null;
  hexCode: string | null;
  isAccepted: boolean | null;
  createdAt: string;
  updatedAt: string;
  key?: ProductKey;
}

export interface ProductImage {
  id: number;
  imageUrl: string;
  image512: string | null;
  createdAt: string;
  updatedAt: string;
}

interface ProductColor {
  hex: string;
  name: string;
}

export interface ProductMetadata {
  color: ProductColor;
  title: string;
  description: string;
  furniture_style: string;
  furniture_material: string;
  furniture_frame_material?: string;
  preferred_room_style?: string;
  [key: string]: any; // For additional dynamic properties
}

export interface ProductStore {
  id: number;
  name: string;
  url: string;
  price: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProductType {
  UID: null;
  artroomSKU: null;
  attrs: ProductAttribute[];
  createdAt: string;
  description: string | null;
  id: number;
  imageURLsId: ProductImage[];
  isAccepted: boolean;
  mainImage: string;
  metaData: ProductMetadata;
  name: string;
  namei18n: null;
  object_image: null;
  price: string;
  priceCategory: null;
  productRelationId: null;
  product_depth: string;
  product_height: string | null;
  product_length: string | null;
  product_links: string;
  product_weight: string;
  product_width: string;
  stores: ProductStore[];
  updatedAt: string;
}

// liked TYpes
interface ProductColor {
  hex: string;
  name: string;
}

export interface ProductMetadata2 {
  color: ProductColor;
  title: string;
  description: string;
  furniture_style: string;
  furniture_material: string;
  preferred_room_style?: string;
}

export interface ProductObjType {
  id: number;
  name: string;
  mainImage: string;
  price: string;
  metaData: ProductMetadata2;
  product_height: string;
  product_width: string;
  product_depth: string;
  imageURLsId: ProductImage[];
  attrs: ProductAttribute[];
  stores: ProductStore[];
}

// detect object
interface BoundingBox {
  height: number;
  width: number;
  x: number;
  y: number;
}

export interface DetectedItem {
  boundingBox: BoundingBox;
  confidence: number;
  croppedImageUrl: string;
  label: string;
}

export interface ImageDetectionResult {
  imageUrl: string;
  items: DetectedItem[];
}
