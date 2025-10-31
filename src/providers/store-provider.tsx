'use client';

import { useRef, useEffect } from 'react';
import { useEmployeeStore, useUIStore, useAuthStore } from '@/store';

export function StoreProvider({ children }: { children: React.ReactNode }) {
    const initialized = useRef(false);

    useEffect(() => {
        if (!initialized.current) {
            initialized.current = true;
        }
    }, []);

    return <>{children}</>;
}