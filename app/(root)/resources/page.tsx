'use client';
import DashNav from '@/components/ui/shared/DashNav';
import { addResource, deleteResource, getResources, updateResource } from '@/lib/actions/resource';
import { Resource } from '@/types';
import React, { useEffect, useState } from 'react';

const Page = () => {
  const [data, setData] = useState<Resource[]>([]);
  const [form, setForm] = useState({
    name: '',
    quantity: 0,
    status: '',
    busyUntil: '', // Using string for date input compatibility
  });
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState<string>('');

  // Fetch resources from the server
  const fetchResources = async () => {
    const list = await getResources();
    setData(list);
  };

  // Handle input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((Form) => ({
      ...Form,
      [name]: name === 'quantity' ? parseInt(value) || 0 : value, // Parse numbers for 'quantity'
    }));
  };

  // Add new resource
  const handleAdd = async () => {
    const formData = {
      ...form,
      busyUntil: form.busyUntil ? new Date(form.busyUntil) : undefined, // Convert to Date
    };
    await addResource(formData);
    setForm({ name: '', quantity: 0, status: '', busyUntil: '' });
    fetchResources();
  };

  // Edit an existing resource
  const handleEdit = (item: Resource) => {
    setForm({
      name: item.name || '',
      quantity: item.quantity || 0,
      status: item.status || '',
      busyUntil: item.busyUntil ? new Date(item.busyUntil).toISOString().split('T')[0] : '', // Format for date input
    });
    setCurrentId(item.id || '');
    setIsEditing(true);
  };

  // Update resource details
  const handleUpdate = async () => {
    const formData = {
      ...form,
      busyUntil: form.busyUntil ? new Date(form.busyUntil) : undefined,
    };
    await updateResource(currentId, formData);
    setForm({ name: '', quantity: 0, status: '', busyUntil: '' });
    setIsEditing(false);
    fetchResources();
  };

  // Delete a resource
  const handleDelete = async (id: string | undefined) => {
    await deleteResource(id);
    fetchResources();
  };

  useEffect(() => {
    fetchResources();
  }, [handleDelete,handleUpdate,handleAdd]);

  return (
    <> <div className="grid grid-cols-[200px_1fr] md:grid-cols-[300px_1fr] h-screen">
          <DashNav />
        <main className="p-4 overflow-auto">
           {data.length > 0 ? (
            <div className="container mt-5">
           <h2 className="mb-4">Resources Table</h2>
           <table className="table table-hover table-striped">
            <thead className="table-dark">
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Quantity</th>
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
                  <td>{item.quantity}</td>
                  <td>{item.status}</td>
                  <td>
                    {item.busyUntil ? new Date(item.busyUntil).toLocaleDateString() : 'N/A'}
                  </td>
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
                  type="number"
                  name="quantity"
                  className="form-control"
                  placeholder="Quantity"
                  value={form.quantity}
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
                  placeholder="Busy Until"
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
        <div className="flex-center wrapper min-h-[200px] w-full flex-col gap-3 rounded-[14px] alert alert-primary bg-grey-50 py-28 text-center">
          <h3 className="p-bold-20 md:h5-bold">No resources found</h3>
          <p className="p-regular-14">Come back later</p>
        </div>
      )}
      </main>
      </div>
    </>
  );
};

export default Page;
