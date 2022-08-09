import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import Users from "./user/pages/User";
import NewPlace from "./places/pages/NewPlace";
import UserPlaces from "./places/pages/UserPlaces";
import UpdatePlace from "./places/pages/UpdatePlace";
import Footer from "../src/shared/components/Navigation/Footer";
import Auth from "./user/pages/Auth";
import EmailVerification from "./user/pages/EmailVerification";
import GetVerified from "./user/pages/GetVerified";
import ResetPassword from "./user/pages/ResetPassword";
import MainNavigation from "./shared/components/Navigation/MainNavigation";
import { AuthContext } from "./shared/context/auth-context";
import { useAuth } from "./shared/hooks/auth-hook";

const App = () => {
  const { token, login, logout, userId } = useAuth();

  return (
    <AuthContext.Provider
      value={{ isLoggedIn: !!token, token, login, logout, userId }}
    >
      <MainNavigation />

      <main style={{ minHeight: "90vh" }}>
        {token && (
          <Routes>
            <Route path="/" element={<Users />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/:userId/places" element={<UserPlaces />} />
            <Route path="/places/new" element={<NewPlace />} />
            <Route path="/places/:placeId" element={<UpdatePlace />} />
            <Route path="*" element={<Navigate to="/" replace={true} />} />
          </Routes>
        )}
        {!token && (
          <Routes>
            <Route path="/" element={<Users />} />
            <Route path="/:userId/places" element={<UserPlaces />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/email-verification" element={<EmailVerification />}></Route>
            <Route path="/email-verify/:userId/:token" element={<GetVerified />}></Route>
            <Route path="*" element={<Navigate to="/auth" replace={true} />} />
          </Routes>
        )}
      </main>
      <Footer />
    </AuthContext.Provider>
  );
};

export default App;
