import { useParams, Navigate } from "react-router-dom";

// Workshop detail pages are now handled inline on /workshops
// Redirect any direct /workshops/:id URLs to the main workshops page
const WorkshopDetail = () => {
  const { id } = useParams();
  return <Navigate to="/workshops" replace />;
};

export default WorkshopDetail;
