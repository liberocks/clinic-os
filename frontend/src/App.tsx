import { BrowserRouter, Route, Routes } from "react-router-dom";

import { UserProvider } from "./context/auth";
import { FormPage } from "./pages/form";
import { MainPage } from "./pages/main";
import { NotFoundPage } from "./pages/not-found";
import { SignInPage } from "./pages/sign-in";

function App() {
  return (
    <UserProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<MainPage />} />
          <Route path="/sign-in" element={<SignInPage />} />
          <Route path="/form/:id" element={<FormPage />} />
          <Route path="/*" element={<NotFoundPage />} />
        </Routes>
      </BrowserRouter>
    </UserProvider>
  );
}

export default App;
