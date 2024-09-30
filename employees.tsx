import { useSession } from 'next-auth/react';
import { api } from '~/trpc/react';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function Employees() {
  const { data: session } = useSession();
  const router = useRouter();
  const { data: employees } = api.employee.getAll.useQuery();

  useEffect(() => {
    if (!session) router.push('/login');
  }, [session, router]);

  if (!session) return <p>Loading...</p>;

  return (
    <div>
      <h1>Employee List</h1>
      <Link href="/employees/create">
        <button className="btn">Create Employee</button>
      </Link>
      <ul>
        {employees?.map(employee => (
          <li key={employee.id}>
            {employee.firstName} {employee.lastName} - {employee.email}
            <Link href={`/employees/edit/${employee.id}`}>
              <button className="btn">Edit</button>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}