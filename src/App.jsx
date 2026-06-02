import { BrowserRouter, Routes, Route } from "react-router-dom";

import Onboarding from "./components/Onboarding";
import Home from "./components/Home";
import Start from "./components/Start";
import Timer from "./components/Timer";
import Mission from "./components/Mission";
import Reward from "./components/Reward";
import Stat from "./components/Stat";
import RestSuccess from "./components/RestSuccess";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Onboarding />} />
        <Route path="/home" element={<Home />} />
        <Route path="/start" element={<Start />} />
        <Route path="/timer" element={<Timer />} />
        <Route path="/mission" element={<Mission />} />
        <Route path="/reward" element={<Reward />} />
        <Route path="/stat" element={<Stat />} />
        <Route path="/success" element={<RestSuccess />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;