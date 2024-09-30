import { useRouter } from 'next/router';
import { api } from '~/trpc/react';
import { useState } from 'react';

export default function EditDepartment() {
  const router = useRouter();
  const { id } = router.query; // Get department id from URL
  const { data: department } = api.department.getById.useQuery(Number(id), { enabled: !!id });
  const updateMutation = api.department.update.useMutation();

  const [formData, setFormData] = useState({
    name: department?.name || '',
    status: department?.status || 'Active',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    await updateMutation.mutateAsync({ ...formData, id: Number(id) });
    router.push('/departments'); // Redirect after updating
  };

  return (
    <div>
      <h1>Edit Department</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Department Name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        />
        <select
          value={formData.status}
          onChange={(e) => setFormData({ ...formData, status: e.target.value })}
        >
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
        </select>
        <button type="submit" className="btn">Update Department</button>
      </form>
    </div>
  );
}
