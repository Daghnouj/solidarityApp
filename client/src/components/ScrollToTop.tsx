import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

interface ScrollToTopProps {
  behavior?: 'auto' | 'smooth';
}

const ScrollToTop: React.FC<ScrollToTopProps> = ({ behavior = 'auto' }) => {
  const { pathname } = useLocation();

  useEffect(() => {
    // Scroll to top on every route change
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: behavior
    });
  }, [pathname, behavior]);

  return null;
};

export default ScrollToTop;