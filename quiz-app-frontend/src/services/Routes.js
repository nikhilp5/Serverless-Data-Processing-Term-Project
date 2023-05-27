import { Route, Routes as Rt } from 'react-router-dom';
import LandingPage from '../components/LandingPage';

const Routes = () => {
    return (
        <Rt>
            <Route path="/" element={<LandingPage />} />
        </Rt>
    )
}

export default Routes;