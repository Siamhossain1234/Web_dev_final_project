/** @jsxImportSource react */
import React, { useState, useEffect } from "react";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import './Dashboard.css';
import RiskMetricsChart from "./RiskMetricsChart";
import axios from "axios";
import { useUser } from "@clerk/clerk-react";
import ProjectSelector from "./ProjectSelector";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function Dashboard() {
  const [projectName, setProjectName] = useState('');
  const [projectId, setProjectId] = useState(null);
  const [projectCode, setProjectCode] = useState(null);
  const [projectUsers, setProjectUsers] = useState([]);
  const [isProjectManager, setIsProjectManager] = useState(false);
  const projectType = localStorage.getItem("projectType");
  const { user } = useUser();
  const [risks, setRisks] = useState([]);
  const [expandedList, setExpandedList] = useState(false);
  const [hasLoadedDefaultProject, setHasLoadedDefaultProject] = useState(false);
  const INITIAL_DISPLAY_COUNT = 3;

  const [newRisk, setNewRisk] = useState({
    title: "",
    description: "",
    likelihood: "",
    severity: "Low",
    date: "",
    assignee_id: "",
    status: "To Do",
  });

  // Add ref for modal
  const modalRef = React.useRef(null);
  const [modalInstance, setModalInstance] = React.useState(null);

  // Initialize modal when component mounts
  useEffect(() => {
    if (modalRef.current) {
      const modal = new window.bootstrap.Modal(modalRef.current);
      setModalInstance(modal);
    }
  }, []);

  // Fetch project users when project ID changes
  useEffect(() => {
    const fetchProjectUsers = async () => {
      if (!projectId) return;
      console.log(projectId)
      try {
        const response = await axios.get(`http://localhost:8080/api/projects/${projectId}/users`);
        setProjectUsers(response.data);
      } catch (error) {
        console.error("Error fetching project users:", error);
      }
    };

    fetchProjectUsers();
  }, [projectId]);

  // Load default project on initial load only
  useEffect(() => {
    const fetchInitialProject = async () => {
      if (!user || hasLoadedDefaultProject) return;

      try {
        const userResponse = await axios.post('http://localhost:8080/api/users', {
          name: user.primaryEmailAddress.emailAddress,
          email: user.primaryEmailAddress.emailAddress,
        });

        const ownedProjects = await axios.get(`http://localhost:8080/api/projects/${userResponse.data.id}/owner`);
        const joinedProjects = await axios.get(`http://localhost:8080/api/projects/${userResponse.data.id}/joined`);
        const allProjects = [...ownedProjects.data, ...joinedProjects.data];

        if (allProjects.length > 0) {
          const project = allProjects[allProjects.length - 1];
          setProjectName(project.name);
          setProjectCode(project.join_code);
          setProjectId(project.id);  //sets initial project only once
          setIsProjectManager(ownedProjects.data.some(p => p.id === project.id));
        }

        setHasLoadedDefaultProject(true);  // prevent re-running
      } catch (error) {
        console.error("Error fetching initial project:", error);
      }
    };

    fetchInitialProject();
  }, [user, hasLoadedDefaultProject]);

  // Update Dashboard
  useEffect(() => {
    const UpdateDashboard = async () => {
      if (!user || !projectId) return;
      console.log("Current projectId:", projectId);
  
      try {
        // Fetch project details
        const userResponse = await axios.post('http://localhost:8080/api/users', {
          name: user.primaryEmailAddress.emailAddress,
          email: user.primaryEmailAddress.emailAddress,
        });
  
        // Get all projects user owns and joined
        const ownedProjects = await axios.get(`http://localhost:8080/api/projects/${userResponse.data.id}/owner`);
        const joinedProjects = await axios.get(`http://localhost:8080/api/projects/${userResponse.data.id}/joined`);
        const allProjects = [...ownedProjects.data, ...joinedProjects.data];
  
        // Find the selected project
        const selectedProject = allProjects.find(p => p.id === projectId || p._id === projectId);
  
        if (selectedProject) {
          setProjectName(selectedProject.name);
          setProjectCode(selectedProject.join_code);
          setIsProjectManager(ownedProjects.data.some(p => p.id === selectedProject.id || p._id === selectedProject._id));
        } else {
          console.warn("Selected project not found in user's projects");
        }
  
        // Fetch risks (tickets)
        const risksResponse = await axios.get(`http://localhost:8080/api/tickets/${projectId}/project`);
        setRisks(risksResponse.data);
      } catch (error) {
        console.error("Error updating dashboard:", error);
      }
    };
  
    UpdateDashboard();
  }, [user, projectId]);
  
  const handleInputChange = (e) => {
    setNewRisk({ ...newRisk, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const newRiskData = {
        title: newRisk.title,
        description: newRisk.description,
        likelihood: newRisk.likelihood,
        severity: newRisk.severity,
        date: newRisk.date,
        assignee_id: newRisk.assignee_id || null,
        status: newRisk.status,
        project_id: projectId
      };

      console.log("Submitting risk with data:", newRiskData);
      
      if (!projectId) {
        throw new Error("No project ID available");
      }

      await axios.post('http://localhost:8080/api/tickets', newRiskData);
      
      // Fetch updated list of risks
      const risksResponse = await axios.get(`http://localhost:8080/api/tickets/${projectId}/project`);
      setRisks(risksResponse.data);
      
      // Reset form
      setNewRisk({
        title: "",
        description: "",
        likelihood: "",
        severity: "Low",
        date: "",
        assignee_id: "",
        status: "To Do",
      });
      
      if (modalInstance) {
        modalInstance.hide();
      }
    } catch (error) {
      console.error("Error details:", error.response?.data || error.message);
      alert(`Error creating risk: ${error.response?.data?.error || error.message}`);
    }
  };

  const handleUpdateAssignee = async (ticketId, assigneeId) => {
    try {
      const response = await axios.patch(`http://localhost:8080/api/tickets/${ticketId}/assignee`, {
        assignee_id: assigneeId
      });
      
      setRisks(prev => prev.map(risk => 
        risk.id === ticketId ? response.data : risk
      ));
    } catch (error) {
      console.error("Error updating assignee:", error);
    }
  };

  const handleUpdateStatus = async (ticketId, status) => {
    try {
      const response = await axios.patch(`http://localhost:8080/api/tickets/${ticketId}/status`, {
        status: status
      });
      
      setRisks(prev => prev.map(risk => 
        risk.id === ticketId ? response.data : risk
      ));
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const activeTasks = risks.filter(r => r.status !== "Final" && r.status !== "Resolved");
  const riskHistory = risks.filter(r => r.status === "Final" || r.status === "Resolved");
  const displayedTasks = expandedList ? activeTasks : activeTasks.slice(0, INITIAL_DISPLAY_COUNT);

  const high = risks.filter(r => r.severity === "High" || r.severity === "Critical").length;
  const medium = risks.filter(r => r.severity === "Medium").length;
  const low = risks.filter(r => r.severity === "Low").length;

  const inProgressCount = activeTasks.filter(t => t.status === "In Progress").length;
  const doneCount = riskHistory.length;
  const todoCount = activeTasks.filter(t => t.status === "To Do").length;

  const doughnutData = {
    labels: ["High", "Medium", "Low"],
    datasets: [
      {
        label: "Risks",
        data: [high, medium, low],
        backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"],
        borderWidth: 1,
      },
    ],
  };

  const getPriorityInfo = (severity) => {
    switch(severity) {
      case "Critical":
        return { level: "I", color: "#dc3545" }; // Red
      case "High":
        return { level: "II", color: "#fd7e14" }; // Orange
      case "Medium":
        return { level: "III", color: "#ffc107" }; // Yellow
      case "Low":
        return { level: "IV", color: "#28a745" }; // Green
      default:
        return { level: "IV", color: "#6c757d" }; // Gray fallback
    }
  };

  return (
    <div className="container py-4">
      {/* Display the project name and code */}
      <h1 className="project-title">
        {projectName ? projectName : "Loading..."}
        <button 
          className="btn btn-outline-secondary join-code-btn d-inline-flex align-items-center" 
          onClick={() => alert(`Join Code: ${projectCode}`)}
          style={{ width: 'auto'}}
          title="Click to view join code"
        >
          <i className="fas fa-key me-1"></i> Show Join Code
        </button>
      </h1>
      <ProjectSelector setProjectId={setProjectId} projectId={projectId} />
      <div className="dashboard-container">
        {/* Left Column */}
        <div className="left-column">
          <div className="section-header">
            <h2 className="section-title">Active Tasks</h2>
            <span className="task-count">({activeTasks.length} tasks)</span>
          </div>
          
          <div className="task-list">
            {displayedTasks.map((task) => (
              <div key={task.id} className="task-card">
                <div className="task-title">{task.title || 'Untitled'}</div>
                <div className="task-priority">
                  <span className="priority-badge" style={{
                    backgroundColor: getPriorityInfo(task.severity).color,
                    color: task.severity === "Medium" ? "#000" : "#fff" // Black text for yellow
                  }}>
                    Priority {getPriorityInfo(task.severity).level}
                  </span>
                </div>
                <div className="task-date">{task.date || 'No date set'}</div>
                <div className="task-assignee">
                  {isProjectManager ? (
                    <select
                      value={task.assignee?.id || ""}
                      onChange={(e) => handleUpdateAssignee(task.id, e.target.value || null)}
                    >
                      <option value="">Unassigned</option>
                      {projectUsers.map(user => (
                        <option key={user.id} value={user.id}>{user.name}</option>
                      ))}
                    </select>
                  ) : (
                    <span>{task.assignee?.name || 'Unassigned'}</span>
                  )}
                </div>
                <div className="task-status">
                  <select
                    value={task.status || "To Do"}
                    onChange={(e) => handleUpdateStatus(task.id, e.target.value)}
                  >
                    <option value="To Do">To Do</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Final">Final</option>
                    <option value="Resolved">Resolved</option>
                  </select>
                </div>
              </div>
            ))}

            {activeTasks.length > INITIAL_DISPLAY_COUNT && (
              <button 
                className="expand-button"
                onClick={() => setExpandedList(!expandedList)}
              >
                {expandedList ? (
                  <>
                    <span>Show Less</span>
                    <i className="fas fa-chevron-up"></i>
                  </>
                ) : (
                  <>
                    <span>Show More ({activeTasks.length - INITIAL_DISPLAY_COUNT} more)</span>
                    <i className="fas fa-chevron-down"></i>
                  </>
                )}
              </button>
            )}
          </div>

          <div className="mt-5">
            <h2 className="section-title">Risk Summary</h2>
            <div className="mx-auto" style={{ maxWidth: "300px" }}>
              <Doughnut
                data={doughnutData}
                options={{
                  animation: {
                    duration: 800,
                    easing: "easeOutBounce",
                  },
                  responsive: true,
                  plugins: {
                    legend: {
                      position: "bottom",
                    },
                  },
                }}
              />
              <p className="text-center mt-3 fw-semibold">{risks.length} Risks Total</p>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="right-column">
          <button
            className="log-risk-btn"
            data-bs-toggle="modal"
            data-bs-target="#riskModal"
          >
            + Log New Risk
          </button>

          <div>
            <h5 className="metrics-title">Risk Metrics</h5>
            <RiskMetricsChart
              progress={inProgressCount}
              done={doneCount}
              todo={todoCount}
            />
          </div>

          <div className="mt-4">
            <h5 className="metrics-title">Risk History</h5>
            <div className="task-list">
              {riskHistory.map((risk) => (
                <div key={risk.id} className="task-card">
                  <span>{risk.title}</span>
                  <span>{risk.date}</span>
                  <span>{risk.assignee?.name}</span>
                  <span className="text-success fw-bold">{risk.status}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      <div className="modal fade" id="riskModal" ref={modalRef} tabIndex="-1" aria-labelledby="riskModalLabel" aria-hidden="true">
        <div className="modal-dialog">
          <div className="modal-content">
            <form onSubmit={handleSubmit}>
              <div className="modal-header">
                <h5 className="modal-title" id="riskModalLabel">Log New Risk</h5>
                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" />
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label">Risk Name</label>
                  <input type="text" className="form-control" name="title" value={newRisk.title} onChange={handleInputChange} required />
                </div>
                <div className="mb-3">
                  <label className="form-label">Description</label>
                  <textarea className="form-control" name="description" rows="2" value={newRisk.description} onChange={handleInputChange} />
                </div>
                <div className="mb-3">
                  <label className="form-label">Likelihood of Occurrence</label>
                  <select className="form-select" name="likelihood" value={newRisk.likelihood} onChange={handleInputChange} required>
                    <option value="">Select likelihood</option>
                    <option value="Very Likely">Very Likely</option>
                    <option value="Likely">Likely</option>
                    <option value="Possible">Possible</option>
                    <option value="Unlikely">Unlikely</option>
                    <option value="Rare">Rare</option>
                  </select>
                </div>
                <div className="mb-3">
                  <label className="form-label">Severity / Impact</label>
                  <select className="form-select" name="severity" value={newRisk.severity} onChange={handleInputChange} required>
                    <option value="">Select severity</option>
                    <option value="Critical">Critical</option>
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>
                <div className="mb-3">
                  <label className="form-label">Deadline</label>
                  <input type="date" className="form-control" name="date" value={newRisk.date} onChange={handleInputChange} required />
                </div>
                <div className="mb-3">
                  <label className="form-label">Assignee (Optional)</label>
                  <select className="form-select" name="assignee_id" value={newRisk.assignee_id} onChange={handleInputChange}>
                    <option value="">Unassigned</option>
                    {projectUsers.map(user => (
                      <option key={user.id} value={user.id}>{user.name}</option>
                    ))}
                  </select>
                </div>
                <div className="mb-3">
                  <label className="form-label">Status</label>
                  <select className="form-select" name="status" value={newRisk.status} onChange={handleInputChange} required>
                    <option value="">Select status</option>
                    <option value="To Do">To Do</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Final">Final</option>
                    <option value="Resolved">Resolved</option>
                  </select>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                <button type="submit" className="btn btn-primary">Log Risk</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
