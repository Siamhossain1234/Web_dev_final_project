import { Container, Row, Button, Col, Form } from 'react-bootstrap';
import axios from 'axios'
import './Start.css';
import { useNavigate } from 'react-router-dom';
import {useUser} from '@clerk/clerk-react'
import { useState } from 'react';

const Start = () =>{
    const [projectName,setProjectName] = useState("");
    const [projectCode,setProjectCode] = useState("");
    //const [setJoinCode] = useState("");
    const navigate = useNavigate();
    const {user} = useUser();
    // Function to generate a random 6-character code
    const generateJoinCode = () => {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let result = '';
        for (let i = 0; i < 6; i++) {
            result += characters.charAt(Math.floor(Math.random() * characters.length));
        }
        return result;
    };
    //add user if not already there
    const addUser = async (e) =>{
        console.log("User being created");
        //check if user exists through axios get clerk username/email and see if it exists
        console.log(user);
        const response = await axios.post('http://localhost:8080/api/users',{
            name: user.primaryEmailAddress.emailAddress,
            email: user.primaryEmailAddress.emailAddress
        })
        console.log(response.data);
        //return user id
        return response.data.id;
    }
    /* When the user clicks on the button,
    toggle between hiding and showing the dropdown content */
    function showForm() {
        document.getElementById("myDropdown").classList.toggle("show");
    }
    function show2ndForm() {
        document.getElementById("my2ndDropdown").classList.toggle("show");
    }
    // Function to handle the API request when button is clicked
    const handleCreateProject = async (e) => {
        e.preventDefault();
        console.log("Create function went off");
        try {
            const id = await addUser();//Adds user if they dont exist
            const generatedCode = generateJoinCode();
            console.log("creating project, join code:", generatedCode);
            const response = await axios.post("http://localhost:8080/api/projects",{
                name: projectName//send in the name of the project
                ,owner_id: id//Make user owner of the project
                ,join_code: generatedCode
            })
            console.log(response.data); // Log response
            
            //add to local storage so it saves
            localStorage.setItem("projectType", "Created"); // save
            console.log(localStorage.getItem("projectType"));
            navigate('/dashboard');
        } catch (error) {
            console.error("Error creating project:", error);
        }
    };
    //function for joining the project
    const handleJoinProject = async (e) => {
        e.preventDefault();
        console.log("Join function went off");
        try {
            const id = await addUser();
            console.log(id);
            //Find Project by join code
            const response = await axios.get("http://localhost:8080/api/projects/code", {
                params: { code: projectCode }
            });
            console.log("Project found:", response.data);
            
            //Add User to project
            const response2 = await axios.post(`http://localhost:8080/api/projects/${response.data.id}/users`, {
                userId: id
            });
            console.log("User added to project:", response2.data);
            
            //add to local storage so it saves
            localStorage.setItem("projectType", "Joined");
            console.log(localStorage.getItem("projectType"));
            navigate('/dashboard');
        } catch (error) {
            console.error("Error joining project:", error);
        }
    };
    {return(
        <div fixed='top' class=" start-page page-wrapper w-full bg-center bg-cover px-8">
            <div className="gradient-bg"></div>
            <div className="waves">
                <div className="wave"></div>
                <div className="wave"></div>
                <div className="wave"></div>
            </div>
            <Container className="content d-flex flex-column justify-content-center align-items-center vh-100">
                {/* Centering the Welcome Text */}
                <Row className="text-center mb-4">
                    <Col>
                        <h1 class='Welcome'>Risk Management</h1>
                        <h3 class='subtitle'>Better Safe Than Sorry</h3>
                    </Col>
                </Row>
                {/* Centering the Buttons */}
                <Row>
                    <Col xs={6}>
                        {/* triggers form which on submit will create the project */}
                        <Form class="dropdown" onSubmit={handleCreateProject}> 
                            <Button size='lg' onClick={showForm} className="btn-custom btn-create">Create a Project</Button>
                            <div id="myDropdown" class="dropdown-content">
                                <input type="name" value={projectName} placeholder='Enter Project Name' onChange={(e)=>{setProjectName(e.target.value)}}/>
                                <button type='submit'>submit</button>
                            </div>
                        </Form>
                    </Col>
                    <Col xs={6}>
                        {/* triggers form which on submit will Join the project */}
                        <Form class="dropdown" onSubmit={handleJoinProject}> 
                            <Button size='lg' onClick={show2ndForm} className="btn-custom btn-join">Join a Project</Button>
                            <div id="my2ndDropdown" class="dropdown-content">
                                <input type="code" value={projectCode} placeholder='Enter Join Code' onChange={(e)=>{setProjectCode(e.target.value)}}/>
                                <button type='submit'>submit</button>
                            </div>
                        </Form>
                    </Col>
                </Row>
            </Container>
            {/* Picture */}
            <div class='picture'></div>
        </div>
    )}
}

export default Start;