import { BrowserRouter, Routes, Route, Navigate } from "react-router";
import WeatherDashboard from "./components/weather/WeatherDashboard";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/weather" element={<WeatherDashboard />} />
        <Route path="*" element={<Navigate to="/weather" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
