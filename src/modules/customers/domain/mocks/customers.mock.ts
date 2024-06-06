import { CustomerEntity } from "../entities/customer.entity";

export const mockCustomer1: CustomerEntity = {
    id: 'd290f1ee-6c54-4b01-90e6-d701748f0851',
    name: 'John Doe',
    contact: 'john.doe@example.com',
    active: true,
    created_at: new Date('2024-06-05T10:00:00Z'),
    companies: ['Company A', 'Company B'],
    user_id: '',
};

export const mockCustomer2: CustomerEntity = {
    id: 'a8a7b9ec-7844-4c3b-932e-3db6be6e5e49',
    name: 'Jane Smith',
    contact: 'jane.smith@example.com',
    active: false,
    created_at: new Date('2024-05-01T14:30:00Z'),
    companies: ['Company C'],
    user_id: '',
};