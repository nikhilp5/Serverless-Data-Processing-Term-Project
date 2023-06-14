import { Route, Routes as Rt } from 'react-router-dom';
import LandingPage from '../components/LandingPage';
import WelcomePage from '../components/team-management/WelcomePage';
import TeamOperations from '../components/team-management/TeamOperations';
import SignIn from '../components/user-authentication/SignIn';
import SecurityForm from '../components/user-authentication/SecurityForm';
import Profile from '../components/profile-management/Profile';

const Routes = () => {
    return (
        <Rt>
            <Route path="/" element={<LandingPage />} />
            <Route path="/SignIn" element={<SignIn />} />
            <Route path="/welcome" element={<WelcomePage />} />
            <Route path="/TeamOperations" element={<TeamOperations />} />
            <Route path="/SecurityForm" element={<SecurityForm/>} />
            <Route path="/Profile" element={<Profile/>} />
        </Rt>
    )
}

export default Routes;