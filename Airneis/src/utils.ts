import {ApiError} from './types/APIError';
import {CartItem} from './types/Cart';
import {Product} from './types/Product';

export const getError = (error: ApiError) => {
  return error.response && error.response.data.message
    ? error.response.data.message
    : error.message;
};

export const ConvertProductToCartItem = (product: Product): CartItem => {
  const cartItem: CartItem = {
    _id: product._id || '',
    name: product.name,
    slug: product.slug,
    image: product.URLimages[0],
    price: product.price || 0,
    stock: product.stock || 0,
    quantity: 1,
    category: product.category,
  };
  return cartItem;
};

export const formatImageUrl = (imageUrl: string): string => {
  const baseUrl = 'https://airneisstaticassets.onrender.com';
  if (imageUrl.startsWith('../public')) {
    return `${baseUrl}${imageUrl.replace('../public', '')}`;
  } else if (imageUrl.startsWith('/images')) {
    return `${baseUrl}/${imageUrl}`;
  } else {
    return imageUrl;
  }
};
