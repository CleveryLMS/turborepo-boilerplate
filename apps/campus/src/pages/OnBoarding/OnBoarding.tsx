import { useContext, useEffect } from 'react';
import { Route, Routes } from 'react-router-dom';

import { OnBoardingForm } from './views/OnBoardingForm';
import { LayoutContext } from '../../shared/context';

import './OnBoarding.scss';

const OnBoarding = () => {
  const { setShowHeader, setShowSidebar } = useContext(LayoutContext);

  useEffect(() => {
    setShowHeader(false);
    setShowSidebar(false);
  }, []);

  return (
    <div className="page-container">
      <Routes>
        <Route index element={<OnBoardingForm />} />
        <Route path=":hashCode" element={<OnBoardingForm />} />
      </Routes>
    </div>
  );
};

export default OnBoarding;
