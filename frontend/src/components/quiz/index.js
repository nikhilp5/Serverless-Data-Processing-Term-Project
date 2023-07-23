import React, { useContext, useEffect, useMemo, useState } from 'react';
import {
	Button,
	Typography,
	Paper,
	Box,
	LinearProgress,
	CircularProgress,
} from '@mui/material';
import { quizQuestions } from './questions';
import { styled } from '@mui/styles';
import { WebSocketContext } from '../WebSocketContext/WebSocketProvider';
import { useDispatch, useSelector } from 'react-redux';
import { setIsQuestionLoading } from '../../redux/quizSlice';

const Quiz = (props) => {
	// TODO: Work on getting team Id when start game
	const teamId = 'team-1689466532241';
	const gameId = '033c70b0-22e2-11ee-898b-dfc6867500b6';

	const quiz = useSelector((state) => state.quiz);

	const currentQuestion = quiz.currentQuestion;
	const currentQuestionIndex = quiz.currentQuestionIndex + 1;
	const totalQuestions = quiz.totalQuestions;

	const [selectedOption, setSelectedOption] = useState(null);
	const [score, setScore] = useState(0);

	const dispatch = useDispatch();

	const { webSocket, message } = useContext(WebSocketContext);

	console.log('Quiz', quiz);

	const handleOptionChange = (option) => {
		setSelectedOption(option);
	};

	const handleNextQuestion = () => {
		dispatch(setIsQuestionLoading(true));
		const request = {
			action: 'NEXT_QUESTION',
			data: {
				teamId: teamId,
				gameId: gameId,
			},
		};
		webSocket.send(JSON.stringify(request));
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

	const styles = {
		box: {
			display: 'flex',
			flexDirection: 'column',
			width: '85%',
			maxWidth: '600px',
			m: 'auto',
			mt: '1rem',
			p: '1.5rem',
			bgcolor: '#F5F5F5',
			boxShadow: '0px 15px 25px rgba(0, 0, 0, 0.1)',
		},
		typography: {
			textAlign: 'center',
			mb: '0.5rem',
			fontSize: '1.5rem',
			color: '#3f51b5',
			fontWeight: 'bold',
		},
		linearProgress: {
			mt: '0.5rem',
			bgcolor: '#eee',
			height: '0.8rem',
			borderRadius: '0.5rem',
		},
		question: {
			textAlign: 'center',
			m: '1.5rem 0',
			fontSize: '1.3rem',
			color: '#555',
		},
		option: (option) => ({
			padding: '0.8rem',
			margin: '0.8rem 0',
			cursor: 'pointer',
			transition: 'all 0.3s ease',
			borderRadius: '1rem',
			boxShadow: '0px 10px 15px rgba(0, 0, 0, 0.1)',
			bgcolor: option === selectedOption ? '#4CAF50' : '#fff',
			color: option === selectedOption ? '#fff' : '#444',
		}),
		optionText: {
			fontSize: '1rem',
			fontWeight: 500,
			ml: '1rem',
			color: '#444',
		},
		button: {
			display: 'block',
			m: '1.5rem auto 0',
			p: '0.75rem 1.5rem',
			fontSize: '0.9rem',
			fontWeight: 'bold',
		},
	};

	return (
		<Box sx={styles.box}>
			<Typography sx={styles.typography}>
				<span>Question {currentQuestionIndex}</span>/ {totalQuestions}
			</Typography>
			<LinearProgress
				variant='determinate'
				value={(currentQuestionIndex / totalQuestions) * 100}
				sx={styles.linearProgress}
			/>
			<Typography variant='h4' component='h1' sx={styles.question}>
				{currentQuestion.question}
			</Typography>

			{options.map((option, index) => (
				<Paper
					elevation={2}
					key={index}
					sx={styles.option(option)}
					onClick={() => handleOptionChange(option)}
				>
					<Typography variant='body1' sx={styles.optionText}>
						{option}
					</Typography>
				</Paper>
			))}

			<Button
				disabled={!selectedOption}
				variant='contained'
				color='primary'
				onClick={handleNextQuestion}
				sx={styles.button}
			>
				{quiz.isQuestionLoading ? (
					<CircularProgress color='inherit' size={24} />
				) : (
					'Submit'
				)}
			</Button>
		</Box>
	);
};

export default Quiz;
