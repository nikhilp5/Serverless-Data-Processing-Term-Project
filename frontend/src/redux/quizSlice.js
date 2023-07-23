import { createSlice } from '@reduxjs/toolkit';

export const quizSlice = createSlice({
	name: 'quiz',
	initialState: {
		firstQuestion: {},
		questions: [],
		totalQuestions: 0,
		currentQuestionIndex: 0,
	},
	reducers: {
		setQuiz: (state, action) => {
			state.firstQuestion = action.payload.firstQuestion;
			state.questions = action.payload.questions;
			state.totalQuestions = action.payload.totalQuestions;
		},
		updateQuiz: (state, action) => {
			state[action.payload.key] = action.payload.value;
		},
		resetQuiz: (state) => {
			state.firstQuestion = {};
			state.questions = [];
			state.totalQuestions = 0;
		},
	},
});

export const { setQuiz, updateQuiz, resetQuiz } = quizSlice.actions;

export default quizSlice.reducer;
