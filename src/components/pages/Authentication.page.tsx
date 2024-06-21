import React from 'react';
import AuthClient from '../AuthClient';

const Authentication = () => {
  return (
    <div className="flex flex-col justify-start pt-20 items-center grow gap-10">
      <div>
        <p className="text-6xl">Welcome to Thiscord!</p>
        <p className="text-4xl">Please sign up or sign in to continue</p>
      </div>
      <AuthClient />
    </div>
  );
};

export default Authentication;
