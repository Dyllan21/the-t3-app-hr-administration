import { useRouter } from 'next/router';
import { api } from '~/trpc/react';
import { useState } from 'react';
import Button from '~/app/_components/Button';

export default function CreateDepartment() {
  const router = useRouter();
  const createMutation = api.department.create.useMutation();

  const [formData, setFormData] = useState({
    name: '',
    status: 'Active',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    await createMutation.mutateAsync(formData);
    router.push('/departments'); // Redirect after creating
  };

  return (
    <div>
      <h1>Create Department</h1>
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
        <button type="submit" className="btn">Create Department</button>
        <Button type="submit">Create Employee</Button>
      </form>
    </div>
  );
}


