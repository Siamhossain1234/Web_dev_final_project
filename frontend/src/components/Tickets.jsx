import { useState, useEffect } from "react";

const Tickets = ({ projectId }) => {
    const [tickets, setTickets] = useState([]);

    useEffect(() => {
        fetch(`http://localhost:8080/api/tickets/project/${projectId}`)
            .then(res => res.json())
            .then(data => setTickets(data))
            .catch(err => console.error("Error fetching tickets:", err));
    }, [projectId]);

    return (
        <div>
            <h2>Tickets</h2>
            <ul>
                {tickets.map(ticket => (
                    <li key={ticket._id}>
                        <strong>{ticket.title}</strong> - {ticket.status}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Tickets;
