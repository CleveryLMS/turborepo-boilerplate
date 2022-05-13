import { useContext, useEffect } from 'react';
import { Route, Routes, useNavigate } from 'react-router-dom';

import { LayoutContext, LoginContext } from '../../shared/context';

import { ActivePage } from './views/ActivePage';
import { InactivePage } from './views/InactivePage';
import { RegisterForm } from './views/RegisterForm';

import './Register.scss';

const Register = () => {
  const navigate = useNavigate();

  const { user } = useContext(LoginContext);
  const { setShowHeader, setShowSidebar } = useContext(LayoutContext);

  useEffect(() => {
    if (user) navigate('/');
  }, []);

  useEffect(() => {
    setShowHeader(false);
    setShowSidebar(false);
  }, []);

  return (
    <div className="page-container">
      <Routes>
        <Route index element={<RegisterForm />} />
        <Route path="empezar" element={<ActivePage />} />
        <Route path="inactivo" element={<InactivePage />} />
      </Routes>
    </div>
  );
};

export default Register;
