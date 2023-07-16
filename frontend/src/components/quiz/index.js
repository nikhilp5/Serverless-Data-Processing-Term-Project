import React, { useState } from 'react';
import { Button, Typography, Paper, Box } from '@mui/material';
import { quizQuestions } from './questions';
import { makeStyles } from '@mui/styles';

const useStyles = makeStyles((theme) => ({
	quizContainer: {
		display: 'flex',
		flexDirection: 'column',
		width: '40%',
		margin: 'auto',
		marginTop: '1rem',
		border: '1px solid #0044ff',
		borderRadius: 5,
		padding: '2rem',
		backgroundColor: '#fff',
		boxShadow: '0px 15px 25px rgba(0, 0, 0, 0.1)',
	},
	quizTitle: {
		textAlign: 'center',
		marginBottom: '1rem',
		fontSize: 'larger',
	},
	question: {
		textAlign: 'center',
		margin: '2rem 0',
	},
	option: {
		padding: '1rem',
		marginBottom: '1rem',
		cursor: 'pointer',
		transition: 'all 0.3s ease',
		borderRadius: '2rem',
	},
	optionText: {
		fontSize: '1.2rem',
		fontWeight: 500,
		marginLeft: '1rem',
	},
	optionHover: {
		backgroundColor: '#f0f0f0',
	},
	optionSelected: {
		backgroundColor: 'green',
		color: '#fff',
	},
	nextBtn: {
		display: 'block',
		margin: '2rem auto 0',
	},
}));

const Quiz = () => {
	const classes = useStyles();
	const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
	const [selectedOption, setSelectedOption] = useState(null);
	const [score, setScore] = useState(0);

	const currentQuestion = quizQuestions[currentQuestionIndex];

	const handleOptionChange = (option) => {
		setSelectedOption(option);
	};

	const handleNextQuestion = () => {
		if (selectedOption === currentQuestion.correctAnswer) {
			setScore(score + 1);
		}
		setSelectedOption(null);

		if (currentQuestionIndex + 1 < quizQuestions.length) {
			setCurrentQuestionIndex(currentQuestionIndex + 1);
		} else {
			alert(`Quiz ended! Your score is: ${score}`);
		}
	};

	return (
		<Box className={classes.quizContainer}>
			<Typography className={classes.quizTitle}>
				<span>Question {currentQuestionIndex + 1}</span>/
				{quizQuestions.length}
			</Typography>

			<Typography
				variant='h4'
				component='h1'
				className={classes.question}
			>
				{currentQuestion.question}
			</Typography>
			{currentQuestion.options.map((option, index) => (
				<Paper
					elevation={2}
					key={index}
					className={`${classes.option} ${
						option === selectedOption ? classes.optionSelected : ''
					}`}
					onClick={() => handleOptionChange(option)}
				>
					<Typography variant='body1' className={classes.optionText}>
						{option}
					</Typography>
				</Paper>
			))}
			<Button
				disabled={!selectedOption}
				variant='contained'
				color='primary'
				className={classes.nextBtn}
				onClick={handleNextQuestion}
			>
				Next Question
			</Button>
		</Box>
	);
};

export default Quiz;
