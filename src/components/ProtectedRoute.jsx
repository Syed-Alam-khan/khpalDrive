import { Navigate } from 'react-router-dom';

export default function ProtectedRoute({ children }) {
  const userInfoStr = localStorage.getItem('userInfo');
  let userInfo = null;
  try {
    userInfo = userInfoStr ? JSON.parse(userInfoStr) : null;
  } catch (e) {
    console.error('Failed to parse userInfo block', e);
  }
  const user = userInfo?.user || userInfo;

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
