import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";

export default function Dashboard() {
  const [projects, setProjects] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await API.get("projects/");
        console.log("Projects response:", res.data);
        setProjects(res.data);
      } catch (err) {
        console.error("Error fetching projects:", err.response || err);
        localStorage.clear();
        navigate("/login");
      }
    };
    fetchProjects();
  }, [navigate]);

  return (
    <div className="min-h-screen bg-pink-50 p-8">
      <h1 className="text-4xl font-extrabold mb-8 text-purple-700">My Dashboard</h1>

      {projects.length === 0 ? (
        <p className="text-gray-500 text-lg">No projects assigned yet.</p>
      ) : (
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((proj) => (
            <div
              key={proj.id}
              className="bg-white rounded-2xl shadow-lg p-6 transform transition duration-500 hover:scale-105 hover:shadow-2xl"
            >
              <h2 className="text-2xl font-semibold text-purple-600">{proj.title}</h2>
              <p className="text-gray-600 mt-2">{proj.description}</p>

              <p className="text-sm text-gray-500 mt-3">
                <span className="font-medium text-purple-500">Trainer:</span> {proj.trainer_name} |{" "}
                <span className="font-medium text-purple-500">Trainee:</span> {proj.trainee_name}
              </p>

              {/* Animated Pastel Progress Bar */}
              <div className="w-full bg-purple-100 rounded-full h-4 mt-5 overflow-hidden">
                <div
                  className="h-4 rounded-full bg-gradient-to-r from-pink-300 via-yellow-200 to-green-300 transition-all duration-1000 ease-out animate-progress"
                  style={{ width: `${proj.progress}%` }}
                ></div>
              </div>
              <p className="text-right text-sm mt-2 text-purple-500 font-semibold">
                {proj.progress}% complete
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
