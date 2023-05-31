import { Route, Routes as Rt } from 'react-router-dom';
import LandingPage from '../components/LandingPage';
import SignIn from '../components/SignIn';

const Routes = () => {
    return (
        <Rt>
            <Route path="/" element={<SignIn />} />
        </Rt>
    )
}

export default Routes;