import { Box, Button, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

const AdminLandingPage = () => {
  const navigate = useNavigate();

  const manageQuestions = () => {
    navigate("/questionsmanagepage");
  };
  const manageGames = () => {
    navigate("/gamesmanagepage");
  };
  const manageData = () => {
    navigate("/engagementpage");
  };
  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
    >
      <Box width="33%">
        <Box mb={2}>
          <Typography variant="h6" align="center" gutterBottom>
            Add, edit, and delete trivia question
          </Typography>
        </Box>
        <Box textAlign="center">
          <Button color="success" variant="contained" onClick={manageQuestions}>
            Manage Questions
          </Button>
        </Box>
      </Box>
      <Box width="33%">
        <Box mb={2}>
          <Typography variant="h6" align="center" gutterBottom>
            Create and manage trivia games
          </Typography>
        </Box>
        <Box textAlign="center">
          <Button color="success" variant="contained" onClick={manageGames}>
            Manage games
          </Button>
        </Box>
      </Box>
      <Box width="33%">
        <Box mb={2}>
          <Typography variant="h6" align="center" gutterBottom>
            Monitor and analyze gameplay data
          </Typography>
        </Box>
        <Box textAlign="center">
          <Button color="success" variant="contained" onClick={manageData}>
            Check data
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default AdminLandingPage;
