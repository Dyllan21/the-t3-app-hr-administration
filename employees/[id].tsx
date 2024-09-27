import { useRouter } from 'next/router';
import { api } from '../../utils/trpc';
import { useState } from 'react';

export default function EditEmployee() {
  const router = useRouter();
  const { id } = router.query; // Get employee id from URL
  const { data: employee } = api.employee.getById.useQuery(Number(id), { enabled: !!id });
  const updateMutation = api.employee.update.useMutation();

  const [formData, setFormData] = useState({
    firstName: employee?.firstName || '',
    lastName: employee?.lastName || '',
    phone: employee?.phone || '',
    email: employee?.email || '',
    status: employee?.status || 'Active',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    await updateMutation.mutateAsync({ ...formData, id: Number(id) });
    router.push('/employees'); // Redirect after updating
  };

  return (
    <div>
      <h1>Edit Employee</h1>
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
        <button type="submit" className="btn">Update Employee</button>
      </form>
    </div>
  );
}
