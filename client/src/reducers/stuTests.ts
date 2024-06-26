import { StuTestsAction } from '../actions/action-types/stutests.ts';
import {
  STU_TESTS_SUCCESS,
  STU_TESTS_FAIL,
  STU_TESTS_REQUEST,
  STU_TESTS_LOADED,
} from '../actions/types.ts';

interface StutestsState {
  stutests: string[]
  loading: boolean
  error: null,
}

const initialState = {
  stutests: [], // Initial state for the difficulty levels data
  loading: true, // Indicates whether the data is being loaded or not
  error: null,
};

export const stutestsReducer = (state: StutestsState = initialState, action: StuTestsAction) => {
  const { type, payload } = action;

  switch (action.type) {
    case STU_TESTS_LOADED:
      return {
        ...state,
        stutests: action.payload, // Set the tests data from the action payload
        loading: false, // Set loading to false, as the data has been successfully loaded
      };

    case STU_TESTS_SUCCESS:
      return {
        ...state,
        stutests: { ...state, stutests: action.payload }, // Add the tests data from the action payload
        loading: false, // Set loading to false, as the data has been successfully loaded
      };

    case STU_TESTS_FAIL:
      return {
        ...state,
        stutests: [], // Clear the tests data in case of failure
        loading: false, // Set loading to false, as the data loading has failed
        error: payload,
      };
    default:
      return state;
  }
}


