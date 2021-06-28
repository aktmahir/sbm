export const initialState = {
  basket: [],
  user: null,
  products: [],
  categories: [],
  companies: [],
  sub_categories: [],
  category_properties: [],
  adminArr: [],
  home: {
    id: "",
    data: {
      slides: [],
      homeContent: [],
      aboutUsContent: "",
      oldAboutUs: "",
      olderAboutUS: "",
      contactUsContent: "",
      oldContactUs: "",
      olderContactUs: "",
      cookiesContent: "",
      oldCookies: "",
      userCredContent: "",
      oldUserCred: "",
    },
  },
  adminArr: [],
  reload: true,
};
export const getBasketTotal = (basket) =>
  basket?.reduce((amaunt, item) => item.price + amaunt, 0);

const reducer = (state, action) => {
  switch (action.type) {
    case "ADD_TO_BASKET":
      return {
        ...state,
        basket: [...state.basket, action.item],
      };
    case "REMOVE_FROM_BASKET":
      const index = state.basket.findIndex(
        (basketItem) => basketItem.id === action.id
      );
      let newBasket = [...state.basket];
      if (index >= 0) {
        newBasket.splice(index, 1);
      } else {
        console.warn(
          `Can't remove product (id: ${action.id}) as its not in basket!`
        );
      }
      return {
        ...state,
        basket: newBasket,
      };
    case "SET_USER":
      return { ...state, user: action.user };
    case "EMPTY_BASKET":
      return { ...state, basket: [] };
    case "SET_PRODUCTS":
      return { ...state, products: action.products };
    case "SET_CATEGORIES":
      return { ...state, categories: action.categories };
    case "SET_SUB_CATEGORIES":
      return { ...state, sub_categories: action.sub_categories };
    case "SET_CATEGORY_PROPERTIES":
      return { ...state, category_properties: action.category_properties };
    case "SET_COMPANIES":
      return { ...state, companies: action.companies };
    case "SET_HOME":
      return { ...state, home: action.home };
    case "RELOAD_TRUE":
      return { ...state, reload: true };
    case "RELOAD_FALSE":
      return { ...state, reload: false };
    default:
      return state;
  }
};

export default reducer;
