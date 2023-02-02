import React from 'react';
import AuthRedirector from './AuthRedirector';

function withAuth(isLoginRequired, Component) {
  return <Component isLoginRequired />
}

export default withAuth;