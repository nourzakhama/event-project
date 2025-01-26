'use client';
import DashNav from '@/components/ui/shared/DashNav';
import { addEmploye, deleteEmploye, getEmployes, updateEmploye } from '@/lib/actions/employe';
import { Employe } from '@/types';
import React, { useEffect, useState } from 'react';

const Page = () => {
  const [data, setData] = useState<Employe[]>([]);
  const [form, setForm] = useState({
    name: '',
    role: '',
    status: '',
    busyUntil: '',
  });
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState<string>('');

  const fetchEmployes = async () => {
    try {
      const list = await getEmployes();
      setData(list);
    } catch (error) {
      console.error('Failed to fetch employees:', error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prevForm) => ({ ...prevForm, [name]: value }));
  };

  const handleAdd = async () => {
    try {
      const formData = {
        ...form,
        busyUntil: form.busyUntil ? new Date(form.busyUntil) : undefined,
      };
      await addEmploye(formData);
      setForm({ name: '', role: '', status: '', busyUntil: '' });
      fetchEmployes();
    } catch (error) {
      console.error('Failed to add employee:', error);
    }
  };

  const handleEdit = (item: Employe) => {
    setForm({
      name: item.name || '',
      role: item.role || '',
      status: item.status || '',
      busyUntil: item.busyUntil ? new Date(item.busyUntil).toISOString().split('T')[0] : '',
    });
    setCurrentId(item.id || '');
    setIsEditing(true);
  };

  const handleUpdate = async () => {
    try {
      const formData = {
        ...form,
        busyUntil: form.busyUntil ? new Date(form.busyUntil) : undefined,
      };
      await updateEmploye(currentId, formData);
      setForm({ name: '', role: '', status: '', busyUntil: '' });
      setIsEditing(false);
      fetchEmployes();
    } catch (error) {
      console.error('Failed to update employee:', error);
    }
  };

  const handleDelete = async (id: string | undefined) => {
    try {
      await deleteEmploye(id);
      fetchEmployes();
    } catch (error) {
      console.error('Failed to delete employee:', error);
    }
  };

  useEffect(() => {
    fetchEmployes();
  }, []);

  return (
    <div className="grid grid-cols-[200px_1fr] md:grid-cols-[300px_1fr] h-screen">
      <DashNav />
      <main className="p-4 overflow-auto">
        {data.length > 0 ? (
          <div className="container mt-5">
            <h2 className="mb-4">Employees Table</h2>
            <table className="table table-hover table-striped">
              <thead className="table-dark">
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Busy Until</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {data.map((item) => (
                  <tr key={item.id}>
                    <th scope="row">{item.id}</th>
                    <td>{item.name}</td>
                    <td>{item.role}</td>
                    <td>{item.status}</td>
                    <td>{item.busyUntil ? new Date(item.busyUntil).toLocaleDateString() : '-'}</td>
                    <td>
                      <button
                        className="btn btn-sm btn-primary me-2"
                        onClick={() => handleEdit(item)}
                      >
                        Edit
                      </button>
                      <button
                        className="btn btn-sm btn-danger"
                        onClick={() => handleDelete(item.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <form
              className="d-flex flex-column gap-3"
              onSubmit={(e) => e.preventDefault()}
            >
              <div className="row g-3">
                <div className="col-md-3">
                  <input
                    type="text"
                    name="name"
                    className="form-control"
                    placeholder="Name"
                    value={form.name}
                    onChange={handleChange}
                  />
                </div>
                <div className="col-md-3">
                  <input
                    type="text"
                    name="role"
                    className="form-control"
                    placeholder="Role"
                    value={form.role}
                    onChange={handleChange}
                  />
                </div>
                <div className="col-md-3">
                  <input
                    type="text"
                    name="status"
                    className="form-control"
                    placeholder="Status"
                    value={form.status}
                    onChange={handleChange}
                  />
                </div>
                <div className="col-md-3">
                  <input
                    type="date"
                    name="busyUntil"
                    className="form-control"
                    value={form.busyUntil}
                    onChange={handleChange}
                  />
                </div>
                <div className="col-md-3">
                  {isEditing ? (
                    <button
                      className="btn btn-success"
                      onClick={handleUpdate}
                      type="button"
                    >
                      Update
                    </button>
                  ) : (
                    <button
                      className="btn btn-primary"
                      onClick={handleAdd}
                      type="button"
                    >
                      Add
                    </button>
                  )}
                </div>
              </div>
            </form>
          </div>
        ) : (
          <div className="flex-center wrapper min-h-[200px] w-full flex-col gap-3 rounded-[14px] bg-grey-50 py-28 text-center">
            <h3 className="p-bold-20 md:h5-bold">No employees found</h3>
            <p className="p-regular-14">Come back later</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default Page;
