import { Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import BlogDetails from './pages/BlogDetails';
import CreateBlog from './pages/CreateBlog';
import EditBlog from './pages/EditBlog';
import Dashboard from './pages/Dashboard';
import MyBlogs from './pages/MyBlogs';

function NotFound() {
  return (
    <main className="container not-found">
      <span className="eyebrow">404 · PAGE NOT FOUND</span>
      <h1>Looks like this page wandered off.</h1>
      <p>The address may be out of date, or the page may have moved.</p>
      <a className="button button-primary" href="/">Back to the stories</a>
    </main>
  );
}

export default function App() {
  return (
    <div className="app-shell">
      <Navbar />
      <div className="page-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/blogs/:id" element={<BlogDetails />} />
          <Route
            path="/create"
            element={<ProtectedRoute><CreateBlog /></ProtectedRoute>}
          />
          <Route
            path="/blogs/:id/edit"
            element={<ProtectedRoute><EditBlog /></ProtectedRoute>}
          />
          <Route
            path="/dashboard"
            element={<ProtectedRoute><Dashboard /></ProtectedRoute>}
          />
          <Route
            path="/my-blogs"
            element={<ProtectedRoute><MyBlogs /></ProtectedRoute>}
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
      <Footer />
    </div>
  );
}