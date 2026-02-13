
export interface Address {
    id: string;
    fullName: string;
    company?: string;
    street1: string;
    street2?: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
    phone?: string;
    type: 'SHIPPING' | 'BILLING';
    isDefault: boolean;
}

export type CreateAddressInput = Omit<Address, 'id'>;
export type UpdateAddressInput = Partial<CreateAddressInput>;

const API_BASE = '/api/user/addresses';

export async function getAddresses(): Promise<Address[]> {
    const res = await fetch(API_BASE);
    if (!res.ok) throw new Error('Failed to fetch addresses');
    return res.json();
}

export async function addAddress(data: CreateAddressInput): Promise<Address> {
    const res = await fetch(API_BASE, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    });
    if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || 'Failed to add address');
    }
    return res.json();
}

export async function updateAddress(id: string, data: UpdateAddressInput): Promise<Address> {
    const res = await fetch(`${API_BASE}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    });
    if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || 'Failed to update address');
    }
    return res.json();
}

export async function deleteAddress(id: string): Promise<void> {
    const res = await fetch(`${API_BASE}/${id}`, {
        method: 'DELETE',
    });
    if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || 'Failed to delete address');
    }
}
