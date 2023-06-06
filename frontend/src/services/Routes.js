import { Route, Routes as Rt } from 'react-router-dom';
import LandingPage from '../components/LandingPage';
import WelcomePage from '../components/team-management/WelcomePage';
import TeamOperations from '../components/team-management/TeamOperations';
import SignIn from '../components/SignIn';

const Routes = () => {
    return (
        <Rt>
            <Route path="/" element={<SignIn />} />
            <Route path="/" element={<LandingPage />} />
            <Route path="/welcome" element={<WelcomePage />} />
            <Route path="/TeamOperations" element={<TeamOperations />} />
        </Rt>
    )
}

export default Routes;