import React, { useContext, useEffect, useMemo, useState } from 'react';
import { Button, Typography, Paper, Box, LinearProgress } from '@mui/material';
import { quizQuestions } from './questions';
import { makeStyles } from '@mui/styles';
import { WebSocketContext } from '../WebSocketContext/WebSocketProvider';

const useStyles = makeStyles((theme) => ({
	quizContainer: {
		display: 'flex',
		flexDirection: 'column',
		width: '85%',
		maxWidth: '600px', // reduced from 800px
		margin: 'auto',
		marginTop: '1rem', // reduced from 2rem
		padding: '1.5rem', // reduced from 2rem
		backgroundColor: '#F5F5F5',
		boxShadow: '0px 15px 25px rgba(0, 0, 0, 0.1)',
	},
	quizTitle: {
		textAlign: 'center',
		marginBottom: '0.5rem', // reduced from 1rem
		fontSize: '1.5rem', // reduced from 2rem
		color: '#3f51b5',
		fontWeight: 'bold',
	},
	question: {
		textAlign: 'center',
		margin: '1.5rem 0', // reduced from 2rem
		fontSize: '1.3rem', // reduced from 1.5rem
		color: '#555',
	},
	option: {
		padding: '0.8rem', // reduced from 1rem
		margin: '0.8rem 0', // reduced from 1rem
		cursor: 'pointer',
		transition: 'all 0.3s ease',
		borderRadius: '1rem',
		boxShadow: '0px 10px 15px rgba(0, 0, 0, 0.1)',
		backgroundColor: '#fff',
	},
	optionText: {
		fontSize: '1rem', // reduced from 1.2rem
		fontWeight: 500,
		marginLeft: '1rem',
		color: '#444',
	},
	optionSelected: {
		backgroundColor: '#4CAF50',
		color: '#fff',
	},
	nextBtn: {
		display: 'block',
		margin: '1.5rem auto 0', // reduced from 2rem
		padding: '0.75rem 1.5rem',
		fontSize: '0.9rem', // reduced from 1rem
		fontWeight: 'bold',
	},
	progress: {
		marginTop: '0.5rem', // reduced from 1rem
		backgroundColor: '#eee',
		height: '0.8rem', // reduced from 1rem
		borderRadius: '0.5rem',
	},
}));

const Quiz = (props) => {
	const classes = useStyles();

	const [selectedOption, setSelectedOption] = useState(null);
	const [score, setScore] = useState(0);

	const { webSocket, message } = useContext(WebSocketContext);

	// console.log('message', message.data.question);

	const currentQuestionIndex = message.data.questionIndex + 1;
	const totalQuestions = message.data.totalQuestions;

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

	const currentQuestion = message.data.question;

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
		<Box className={classes.quizContainer}>
			<Typography className={classes.quizTitle}>
				<span>Question {currentQuestionIndex}</span>/ {totalQuestions}
			</Typography>
			<LinearProgress
				variant='determinate'
				value={(currentQuestionIndex / totalQuestions) * 100}
				className={classes.progress}
			/>
			<Typography
				variant='h4'
				component='h1'
				className={classes.question}
			>
				{currentQuestion.question}
			</Typography>

			{options.map((option, index) => (
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
