// src/types/json-fields.ts

export interface OperatingHours {
    monday?: { open: string; close: string; closed: boolean };
    tuesday?: { open: string; close: string; closed: boolean };
    wednesday?: { open: string; close: string; closed: boolean };
    thursday?: { open: string; close: string; closed: boolean };
    friday?: { open: string; close: string; closed: boolean };
    saturday?: { open: string; close: string; closed: boolean };
    sunday?: { open: string; close: string; closed: boolean };
    // Legacy support
    weekday?: string;
}

export interface HeroCTA {
    text: string;
    link: string;
    style: 'primary' | 'secondary' | 'outline';
}

export interface TrustBadge {
    icon: string;
    text: string;
    description?: string;
}

export interface ProductSpecification {
    [key: string]: string | number | boolean;
}

export interface CompatibilityList {
    models: string[];
}
