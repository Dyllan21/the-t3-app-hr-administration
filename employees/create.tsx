import { useRouter } from 'next/router';
import { api } from '~/trpc/client';
import { useState } from 'react';

export default function CreateEmployee() {
  const router = useRouter();
  const createMutation = api.employee.create.useMutation();

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    status: 'Active',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    await createMutation.mutateAsync(formData);
    router.push('/employees'); // Redirect after creating
  };

  return (
    <div>
      <h1>Create Employee</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="First Name"
          value={formData.firstName}
          onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
        />
        <input
          type="text"
          placeholder="Last Name"
          value={formData.lastName}
          onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
        />
        <input
          type="text"
          placeholder="Phone"
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
        />
        <input
          type="email"
          placeholder="Email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        />
        <select
          value={formData.status}
          onChange={(e) => setFormData({ ...formData, status: e.target.value })}
        >
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
        </select>
        <button type="submit" className="btn">Create Employee</button>
      </form>
    </div>
  );
}
