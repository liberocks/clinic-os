import { Suspense, lazy } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import { UserProvider } from "./context/auth";

const FormPage = lazy(() => import("./pages/form"));
const MainPage = lazy(() => import("./pages/main"));
const NotFoundPage = lazy(() => import("./pages/not-found"));
const SignInPage = lazy(() => import("./pages/sign-in"));
const SuccessfulPage = lazy(() => import("./pages/successful"));

function App() {
  return (
    <UserProvider>
      <BrowserRouter>
        <Suspense fallback={null}>
          <Routes>
            <Route path="/" element={<MainPage />} />
            <Route path="/sign-in" element={<SignInPage />} />
            <Route path="/form/:id" element={<FormPage />} />
            <Route path="/success" element={<SuccessfulPage />} />
            <Route path="/*" element={<NotFoundPage />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </UserProvider>
  );
}

export default App;
