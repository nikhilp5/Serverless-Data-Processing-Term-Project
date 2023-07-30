import { Route, Routes as Rt } from 'react-router-dom';
import TeamOperations from '../components/team-management/TeamOperations';
import SignIn from '../components/user-authentication/SignIn';
import SecurityForm from '../components/user-authentication/SecurityForm';
import Profile from '../components/profile-management/Profile';
import UserStats from '../components/profile-management/UserStats';
import LandingPage from '../components/miscelleneous/LandingPage';
import TeamWelcomePage from '../components/team-management/TeamWelcomePage';
import Quiz from '../components/quiz';
import InviteTeamMembers from '../components/team-management/InviteTeamMembers';

const Routes = () => {
	return (
		<Rt>
			<Route path='/' element={<LandingPage />} />
			<Route path='/SignIn' element={<SignIn />} />
			<Route path='/welcomeTeamPage' element={<TeamWelcomePage />} />
			<Route path='/TeamOperations' element={<TeamOperations />} />
			<Route path='/inviteTeam' element={<InviteTeamMembers />} />
			<Route path='/SecurityForm' element={<SecurityForm />} />
			<Route path='/Profile' element={<Profile />} />
			<Route path='/UserStats' element={<UserStats />} />
			<Route path='/Trivia' element={<Quiz />} />
		</Rt>
	);
};

export default Routes;