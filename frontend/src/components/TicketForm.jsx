import { useState } from "react";

const TicketForm = ({ projectId, refreshTickets }) => {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        const response = await fetch("http://localhost:8080/api/tickets/create", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ title, description, projectId }),
        });

        if (response.ok) {
            setTitle("");
            setDescription("");
            refreshTickets();
        } else {
            console.error("Failed to create ticket");
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <input type="text" placeholder="Title" value={title} onChange={e => setTitle(e.target.value)} required />
            <textarea placeholder="Description" value={description} onChange={e => setDescription(e.target.value)} required />
            <button type="submit">Create Ticket</button>
        </form>
    );
};

export default TicketForm;
