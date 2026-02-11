declare namespace Express {
    interface Request {
        user: {
            id: number;
            userRole: string;      // or UserRole enum
            adminRoleId: number | null;
        };
    }
}
