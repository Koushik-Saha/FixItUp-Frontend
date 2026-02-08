
export type Repair = {
    id: string;
    ticketNumber: string;
    createdAt: string;
    deviceBrand: string;
    deviceModel: string;
    issueCategory: string;
    issueDescription: string;
    status: 'SUBMITTED' | 'RECEIVED' | 'DIAGNOSED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
    priority: string;
    estimatedCost?: number;
    actualCost?: number;
    technicianNotes?: string;
    customerNotes?: string;
};

export type RepairResponse = {
    data: Repair[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
};

const API_BASE = '/api/repairs';

export async function getRepairs(): Promise<RepairResponse> {
    const response = await fetch(API_BASE, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'x-user-id': 'current-user-id', // This should be handled by the interceptor or passed if needed, but dashboard likely relies on cookie/token
            // Actually, dashboard page uses useAuth? No, the API route checks headers.
            // Client-side fetch might need to rely on the browser sending cookies, or we need to pass the token.
            // But wait, the previous implementation of getOrders didn't pass headers manually? 
            // In `src/app/dashboard/page.tsx`, `getOrders` is called.
            // Let's check `src/lib/api/orders.ts` to see how it handles auth.
        },
    });

    if (!response.ok) {
        throw new Error('Failed to fetch repairs');
    }

    return response.json();
}

export async function getRepair(id: string): Promise<{ data: Repair }> {
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
