import React, { useContext, useEffect, useMemo, useState } from 'react';
import { Button, Typography, Paper, Box, LinearProgress } from '@mui/material';
import { quizQuestions } from './questions';
import { styled } from '@mui/styles';
import { WebSocketContext } from '../WebSocketContext/WebSocketProvider';
import { useSelector } from 'react-redux';

const StyledBox = styled(Box)(({ theme }) => ({
	display: 'flex',
	flexDirection: 'column',
	width: '85%',
	maxWidth: '600px',
	margin: 'auto',
	marginTop: '1rem',
	padding: '1.5rem',
	backgroundColor: '#F5F5F5',
	boxShadow: '0px 15px 25px rgba(0, 0, 0, 0.1)',
}));

const StyledTypography = styled(Typography)(({ theme }) => ({
	textAlign: 'center',
	marginBottom: '0.5rem',
	fontSize: '1.5rem',
	color: '#3f51b5',
	fontWeight: 'bold',
}));

const StyledQuestion = styled(Typography)(({ theme }) => ({
	textAlign: 'center',
	margin: '1.5rem 0',
	fontSize: '1.3rem',
	color: '#555',
}));

const StyledOption = styled(Paper)(({ theme, selected }) => ({
	padding: '0.8rem',
	margin: '0.8rem 0',
	cursor: 'pointer',
	transition: 'all 0.3s ease',
	borderRadius: '1rem',
	boxShadow: '0px 10px 15px rgba(0, 0, 0, 0.1)',
	backgroundColor: selected ? '#4CAF50' : '#fff',
	color: selected ? '#fff' : '#444',
}));

const StyledOptionText = styled(Typography)(({ theme }) => ({
	fontSize: '1rem',
	fontWeight: 500,
	marginLeft: '1rem',
	color: '#444',
}));

const StyledButton = styled(Button)(({ theme }) => ({
	display: 'block',
	margin: '1.5rem auto 0',
	padding: '0.75rem 1.5rem',
	fontSize: '0.9rem',
	fontWeight: 'bold',
}));

const StyledLinearProgress = styled(LinearProgress)(({ theme }) => ({
	marginTop: '0.5rem',
	backgroundColor: '#eee',
	height: '0.8rem',
	borderRadius: '0.5rem',
}));

const Quiz = (props) => {
	const quiz = useSelector((state) => state.quiz);
	const currentQuestion = quiz.currentQuestion;
	const currentQuestionIndex = quiz.currentQuestionIndex + 1;
	const totalQuestions = quiz.totalQuestions;

	const [selectedOption, setSelectedOption] = useState(null);
	const [score, setScore] = useState(0);

	const { webSocket, message } = useContext(WebSocketContext);

	console.log('Quiz', quiz);

	const handleOptionChange = (option) => {
		setSelectedOption(option);
	};
	const handleNextQuestion = () => {
		// if (selectedOption === currentQuestion.correctAnswer) {
		// 	setScore(score + 1);
		// }
		// setSelectedOption(null);
		// if (currentQuestionIndex + 1 < quizQuestions.length) {
		// 	setCurrentQuestionIndex(currentQuestionIndex + 1);
		// } else {
		// 	alert(`Quiz ended! Your score is: ${score}`);
		// }
	};

	function shuffleArray(array) {
		for (let i = array.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1));
			[array[i], array[j]] = [array[j], array[i]];
		}
		return array;
	}

	const options = useMemo(() => {
		let shuffledOptions = shuffleArray([
			...currentQuestion.options,
			currentQuestion.correctAnswer,
		]);
		return shuffledOptions;
	}, [currentQuestion]);

	return (
		<StyledBox>
			<StyledTypography>
				<span>Question {currentQuestionIndex}</span>/ {totalQuestions}
			</StyledTypography>
			<StyledLinearProgress
				variant='determinate'
				value={(currentQuestionIndex / totalQuestions) * 100}
			/>
			<StyledQuestion variant='h4' component='h1'>
				{currentQuestion.question}
			</StyledQuestion>

			{options.map((option, index) => (
				<StyledOption
					elevation={2}
					key={index}
					selected={option === selectedOption}
					onClick={() => handleOptionChange(option)}
				>
					<StyledOptionText variant='body1'>
						{option}
					</StyledOptionText>
				</StyledOption>
			))}

			<StyledButton
				disabled={!selectedOption}
				variant='contained'
				color='primary'
				onClick={handleNextQuestion}
			>
				Next Question
			</StyledButton>
		</StyledBox>
	);
};

export default Quiz;
