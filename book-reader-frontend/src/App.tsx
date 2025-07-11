import { Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import SearchPage from "./pages/SearchPage";
import RecommendationsPage from "./pages/RecommendationsPage";
import PrivateRoute from "./components/PrivateRoute";
import { ToastContainer } from "react-toastify";
import PricePage from "./pages/PricePage";

function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        <Route path="/" element={<PrivateRoute><HomePage /></PrivateRoute>} />
        <Route path="/search" element={<PrivateRoute><SearchPage /></PrivateRoute>} />
        <Route path="/price" element={<PrivateRoute><PricePage /></PrivateRoute>} />
        <Route path="/recommendations" element={<PrivateRoute><RecommendationsPage /></PrivateRoute>} />
      </Routes>

      <ToastContainer position="top-center" autoClose={3000} hideProgressBar />

    </>
  );
}

export default App;
