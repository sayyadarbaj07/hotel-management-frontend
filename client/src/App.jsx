import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./components/context/authContext";
import AppRoutes from "./components/routes/routes";

const App = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
