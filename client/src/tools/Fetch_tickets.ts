import { BASE_URL } from "@/tools/API_handler";
import { Ticket } from "@/Types/tickets";

export const Fetch_tickets_my = async () => {
    try {
        // Double check your backend prefix: is it /routes/tickets or just /tickets?
        const response = await fetch(`${BASE_URL}/routes/tickets/my`, {
            method: "GET",
            credentials: "include",
            headers: { "Content-Type": "application/json" }
        });
        
        const ticketPayload = await response.json();

        // 1. Handle HTTP errors (401, 403, 500, etc.) safely
        if (!response.ok) {
            console.error(`Server error fetching personal tickets: ${ticketPayload.message || response.statusText}`);
            return null; 
        }

        return ticketPayload;
    } catch (error) {
        console.error(`Network or critical failure fetching personal tickets: ${error}`);
        return null;
    }
};

export const Fetch_tickets_all = async () => {
    try {
        const response = await fetch(`${BASE_URL}/routes/tickets/all`, {
            method: "GET",
            credentials: "include",
            headers: { "Content-Type": "application/json" }
        });
        
        const ticketPayload = await response.json();
        
        // 2. Safely capture authorization rejection or errors
        if (!response.ok) {
            console.error(`Server error fetching all tickets: ${ticketPayload.message || response.statusText}`);
            return null;
        }

        return ticketPayload;
    } catch (error) {
        console.error(`Network or critical failure fetching all tickets: ${error}`);
        return null;
    }
};

export const Update_ticket_approval = async (ticketId: string): Promise<Ticket | null> => {
    try {
        const response = await fetch(`${BASE_URL}/routes/tickets/${ticketId}/approve`, {
            method: "PATCH",
            credentials: "include",
            headers: { "Content-Type": "application/json" }
        });
        
        const ticketPayload = await response.json();
        
        if (!response.ok) {
            console.error(`Server error updating ticket: ${ticketPayload.message || response.statusText}`);
            return null;
        }

        return ticketPayload;
    } catch (error) {
        console.error(`Network or critical failure updating ticket: ${error}`);
        return null;
    }
};

export const Resolve_ticket = async (ticketId: string): Promise<Ticket | null> => {
    try {
        const response = await fetch(`${BASE_URL}/routes/tickets/${ticketId}/resolve`, {
            method: "PATCH",
            credentials: "include",
            headers: { "Content-Type": "application/json" }
        });
        
        const ticketPayload = await response.json();
        
        if (!response.ok) {
            console.error(`Server error resolving ticket: ${ticketPayload.message || response.statusText}`);
            return null;
        }

        return ticketPayload;
    } catch (error) {
        console.error(`Network or critical failure resolving ticket: ${error}`);
        return null;
    }
};