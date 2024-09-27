export interface Employee {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    telephoneNumber?: string;
    manager?: {
      firstName: string;
    };
    status?: 'Active' | 'Inactive';
  }
  