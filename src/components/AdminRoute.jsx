import { Navigate } from 'react-router-dom';

export default function AdminRoute({ children }) {
  const userInfoStr = localStorage.getItem('userInfo');
  let userInfo = null;
  try {
    userInfo = userInfoStr ? JSON.parse(userInfoStr) : null;
  } catch (e) {
    console.error('Failed to parse userInfo block', e);
  }
  const user = userInfo?.user || userInfo;

  if (!user || user?.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  return children;
}
