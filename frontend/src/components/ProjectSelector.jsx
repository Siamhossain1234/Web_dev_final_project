import { useState, useEffect } from "react";
import { useUser } from "@clerk/clerk-react";
import axios from "axios";

const ProjectSelector = ({ setProjectId, projectId }) => {
    const [projects, setProjects] = useState([]);
    const [selectedProject, setSelectedProject] = useState("");
    const { user } = useUser();

    // Sync dropdown selection with projectId from Dashboard
    useEffect(() => {
        console.log("Project Changed")
        if (projectId) {
            setSelectedProject(projectId);
        }
    }, [projectId]);

    useEffect(() => {
        const GetProjects = async () => {
            console.log("Projects from project selector fetched")
            if(!user){
                return;
            }
            try {
                const userResponse = await axios.post('http://localhost:8080/api/users', {
                    name: user.primaryEmailAddress.emailAddress,
                    email: user.primaryEmailAddress.emailAddress,
                });
                const projectRes = await axios.get(`http://localhost:8080/api/projects/${userResponse.data.id}/joined`)
                setProjects(projectRes.data)
                console.log("Fetched projects:", projectRes.data);
            } catch (error) {
                console.error("Error fetching projects", error);
            }
        }
        
        GetProjects();
    }, [user]);

    const handleChange = (event) => {
        console.log("Value is:",event.target.value)
        setSelectedProject(event.target.value);
        setProjectId(event.target.value); // Pass the selected project ID to parent
    };

    return (
        <div>
            <label>Select a Project:</label>
            <select value={selectedProject} onChange={handleChange}>
                <option value="">-- Select Project --</option>
                {projects.map(project => (
                    <option key={project.id} value={project.id}>
                        {project.name}
                    </option>
                ))}
            </select>
        </div>
    );
};

export default ProjectSelector;
