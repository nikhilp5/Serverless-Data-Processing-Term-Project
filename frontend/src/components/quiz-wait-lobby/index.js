import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
	Table,
	TableHead,
	TableRow,
	TableCell,
	TableBody,
	Button,
	Typography,
	Box,
} from '@mui/material';
import { styled } from '@mui/system';
import axios from 'axios';
const StyledButton = styled(Button)(({ theme, ready }) => ({
	color: '#fff',
	background: ready ? '#4caf50' : '#f44336',
	'&:hover': {
		background: ready ? '#45a049' : '#d32f2f',
	},
}));

const StatusBox = styled(Box)(({ theme, ready }) => ({
	color: ready ? '#4caf50' : '#f44336',
	padding: '6px 16px',
	borderRadius: '4px',
	display: 'inline-block',
}));

const StartButton = styled(Button)(({ theme }) => ({
	marginTop: '20px',
	color: '#fff',
	backgroundColor: '#3f51b5',
	'&:hover': {
		backgroundColor: '#303f9f',
	},
	'&:disabled': {
		color: 'rgba(0, 0, 0, 0.26)',
		backgroundColor: 'rgba(0, 0, 0, 0.12)',
	},
}));

const TeamMembers = () => {
	const teamId = 'team-1689466532241';
	const gameId = '033c70b0-22e2-x0x0-898b-dfc6867500b6';

	const [teamData, setTeamData] = useState(null);
	const [teamMembers, setTeamMembers] = useState([]);
	const [teamReady, setTeamReady] = useState(false);
	const currentUserString = sessionStorage.getItem('currentUser');
	const currentUser = JSON.parse(currentUserString);
	const navigate = useNavigate();

	const currentPlayerId = currentUser ? currentUser.email : null;

	const fetchTeamMembers = async () => {
		try {
			const response = await axios.get(
				'https://nc0jzt33ed.execute-api.us-east-1.amazonaws.com/test/teams?teamId=team-1689466532241'
			);
			const data = response.data;
			setTeamData(data);
			setTeamMembers(data.teamMembers);
		} catch (error) {
			console.error('Error fetching team members:', error);
		}
	};

	const checkTeamReady = async () => {
		try {
			const response = await axios.post(
				'https://heot861m04.execute-api.us-east-1.amazonaws.com/dev/isready',
				{
					teamId: teamId,
				}
			);
			setTeamReady(response.data.allReady);
		} catch (error) {
			console.error('Error checking team readiness:', error);
		}
	};
	// console.log('checkTeamReady', checkTeamReady());

	useEffect(() => {
		const timer = setInterval(() => {
			fetchTeamMembers();
			checkTeamReady();
		}, 3000);

		return () => {
			clearInterval(timer);
		};
	}, []);

	const handleReadyToggle = async (userEmail) => {
		if (userEmail === currentPlayerId) {
			const memberIndex = teamMembers.findIndex(
				(member) => member.userEmail === userEmail
			);
			const newReadyStatus = !teamMembers[memberIndex].ready;

			setTeamMembers((prevTeamMembers) =>
				prevTeamMembers.map((member) =>
					member.userEmail === userEmail
						? { ...member, ready: newReadyStatus }
						: member
				)
			);

			try {
				const response = await axios.post(
					'https://uuy9y7vzyl.execute-api.us-east-1.amazonaws.com/dev/status',
					{
						teamId: teamData.teamId,
						userEmail: userEmail,
						ready: newReadyStatus,
					}
				);
				const data = response.data;
				console.log(data);
			} catch (error) {
				console.error('Error updating status:', error);
			}
		}
	};

	const handleStartGame = async () => {
		try {
			const response = await axios.post(
				'https://kc52nbc66j.execute-api.us-east-1.amazonaws.com/dev/start',
				{
					teamId: teamId,
					gameId: gameId, // replace with the actual game ID
				}
			);
			const data = response.data;
			console.log(data);
			navigate('/Quiz');
		} catch (error) {
			console.error('Error starting the game:', error);
		}
	};

	if (!teamMembers.length) {
		// Show a loading indicator or return null until teamMembers data is available
		return <div>Loading...</div>;
	}

	return (
		<div style={{ margin: '20px' }}>
			<h2>Team Members</h2>
			<Table>
				<TableHead>
					<TableRow>
						<TableCell>Member</TableCell>
						<TableCell>Role</TableCell>
						<TableCell>Status</TableCell>
					</TableRow>
				</TableHead>
				<TableBody>
					{teamMembers.map((member) => (
						<TableRow key={member.userEmail}>
							<TableCell>{member.userEmail}</TableCell>
							<TableCell>{member.userRole}</TableCell>
							<TableCell>
								{member.userEmail === currentPlayerId ? (
									<StyledButton
										onClick={() =>
											handleReadyToggle(member.userEmail)
										}
										variant={
											member.ready
												? 'contained'
												: 'outlined'
										}
										ready={member.ready}
									>
										{member.ready ? 'Ready' : 'Not Ready'}
									</StyledButton>
								) : (
									<StatusBox ready={member.ready}>
										<Typography variant='button'>
											{member.ready
												? 'Ready'
												: 'Not Ready'}
										</Typography>
									</StatusBox>
								)}
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
			<StartButton
				variant='contained'
				disabled={!teamReady || currentUser.role !== 'admin'}
				onClick={handleStartGame}
			>
				Start
			</StartButton>
		</div>
	);
};

export default TeamMembers;
