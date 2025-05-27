// App.tsx
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { Anime } from "./Anime";
import { Home } from "./Home";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "./components/ui/card";

export function App() {
  return (
    <Router>
      <div className="flex flex-col w-full min-h-screen">
        {/* Navigation Bar */}
        <header className="bg-white shadow p-4 flex justify-between items-center sticky top-0 z-50">
          <h1 className="text-xl font-bold text-emerald-600">AnimeFinder</h1>
          <nav className="space-x-4">
            <Link to="/" className="text-gray-700 hover:text-emerald-600">
              Home
            </Link>
            <Link to="/search" className="text-gray-700 hover:text-emerald-600">
              Search
            </Link>
          </nav>
        </header>

        {/* Main Content */}
        <main className="flex-1 p-4 sm:p-6 md:p-10">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route
              path="/search"
              element={
                <Card>
                  <CardHeader>
                    <CardTitle>Search Anime</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Anime />
                  </CardContent>
                </Card>
              }
            />
          </Routes>
        </main>
      </div>
    </Router>
  );
}
