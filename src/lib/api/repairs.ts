const API_BASE = '/api/repairs';

export type Repair = {
    id: string;
    date: string; // ISO date string or formatted date
    device: string;
    issue: string;
    status: 'Pending' | 'In Progress' | 'Completed' | 'Canon' | 'Cancelled';
    store: string;
    notes?: string;
};

export async function getRepairs(): Promise<{ repairs: Repair[] }> {
    const response = await fetch(API_BASE, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });

    if (!response.ok) {
        throw new Error('Failed to fetch repairs');
    }

    return response.json();
}

export async function getRepair(id: string): Promise<{ repair: Repair }> {
    const response = await fetch(`${API_BASE}/${id}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });

    if (!response.ok) {
        throw new Error('Failed to fetch repair details');
    }

    return response.json();
}
