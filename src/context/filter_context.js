import React, { useEffect, useContext, useReducer } from 'react'
import reducer from '../reducers/filter_reducer'
import {
  LOAD_PRODUCTS,
  SET_GRIDVIEW,
  SET_LISTVIEW,
  UPDATE_SORT,
  SORT_PRODUCTS,
  UPDATE_FILTERS,
  FILTER_PRODUCTS,
  CLEAR_FILTERS,
} from '../actions'
import { useProductsContext } from './products_context'

const initialState = {
  filtered_products: [],
  all_products: [],
  grid_view: true,
  sort: 'price-lowest',
  filters: {
    text: '',
    category: 'all',
    company: 'all',
    color: 'all',
    min_price: 0,
    max_price: 0,
    price: 0,
    shipping: false,
  }
}

const FilterContext = React.createContext()

export const FilterProvider = ({ children }) => {

  const { products } = useProductsContext();
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    dispatch({ type: LOAD_PRODUCTS, payload: { products } })
  }, [products]);

  useEffect(() => {
    dispatch({ type: FILTER_PRODUCTS });
    dispatch({ type: SORT_PRODUCTS });
  }, [products, state.sort, state.filters])

  const setGridView = () => {
    dispatch({ type: SET_GRIDVIEW })
  }

  const setListView = () => {
    dispatch({ type: SET_LISTVIEW })
  }

  const updateSort = (evt) => {
    const value = evt.target.value;
    dispatch({ type: UPDATE_SORT, payload: { sort: value } })
  }

  // FILTER PART

  const updateFilters = (evt) => {
    const name = evt.target.name;
    let value = evt.target.value;
    if (name === 'category') {
      value = evt.target.textContent;
    }
    if (name === 'color') {
      value = evt.target.dataset.color
    }
    if (name === 'price') {
      value = +value
    }
    if (name === 'shipping') {
      value = evt.target.checked
    }
    dispatch({ type: UPDATE_FILTERS, payload: { name, value } })
  }

  const clearFilters = () => {
    dispatch({ type: CLEAR_FILTERS })
  }


  return (
    <FilterContext.Provider value={{
      ...state,
      setGridView,
      setListView,
      updateSort,
      clearFilters,
      updateFilters
    }}>
      {children}
    </FilterContext.Provider>
  )
}
// make sure use
export const useFilterContext = () => {
  return useContext(FilterContext)
}
