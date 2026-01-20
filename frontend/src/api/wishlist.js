import { authRequest } from "./api";

export const getWishlist = () => authRequest("/wishlist");

export const addToWishlist = (productId) =>
  authRequest(`/wishlist/${productId}`, {
    method: "POST",
  });

export const removeFromWishlist = (productId) =>
  authRequest(`/wishlist/${productId}`, {
    method: "DELETE",
  });
