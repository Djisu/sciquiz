import { FindQuestionAction } from '../actions/action-types/findQuestion.ts';
import {
  FIND_QUESTION_REQUEST,
  FIND_QUESTION_SUCCESS,
  FIND_QUESTION_FAIL,
} from '../actions/types.ts';

interface OtherQuestionState {
  otherQuestion: string[]
  loading: boolean
}

const initialState = {
  otherQuestion: [], // Initial state for the question data
  loading: true, // Indicates whether the data is being loaded or not
};

export function otherQuestionReducer(state: OtherQuestionState = initialState, action: FindQuestionAction) {
  const { type, payload } = action;

  switch (action.type) {
    case FIND_QUESTION_SUCCESS:
      return {
        ...state,
        otherQuestion: payload,
        loading: false,
      };

    case FIND_QUESTION_FAIL:
      return {
        ...state,
        otherQuestion: [], // Clear the questions data in case of failure
        loading: false, // Set loading to false, as the data loading has failed
      };

    default:
      return state;
  }
}


