import { env } from './env';

export const API_ROUTES = {
  USERS: '/usuarios',
  LOGIN: '/login',
  PRODUCTS: '/produtos',
  CARTS: '/carrinhos',
  CART_CANCEL: '/carrinhos/cancelar-compra',
  CART_CONCLUDE: '/carrinhos/concluir-compra'
} as const;

export type ApiRoute = (typeof API_ROUTES)[keyof typeof API_ROUTES];

export const DEFAULT_USER_PASSWORD = env.defaultUserPassword;
