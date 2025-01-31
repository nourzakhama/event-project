'use client';
import DashNav from '@/components/ui/shared/DashNav';
import { addOrder, deleteOrder, getOrders, updateOrder } from '@/lib/actions/order';
import { deleteResource, updateResource } from '@/lib/actions/resource';
import { Order } from '@/types';
import React, { useEffect, useState } from 'react';

const Page = () => {
  const [data, setData] = useState<Order[]>([]);
  const [form, setForm] = useState({
    stripeId: '',
    price: 0,
    eventId: '', // Corrected property name
    buyerId: '',
    status: '',
    eventTitle: '', // Added missing property
    createdAt: '', // This will be converted to a Date object
  });
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState<string>('');

  // Fetch orders from the server
  const fetchOrders = async () => {
    const list = await getOrders();
    setData(list);
  };

  // Handle input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prevForm) => ({
      ...prevForm,
      [name]: name === 'price' ? parseInt(value) || 0 : value, // Parse numbers for 'price'
    }));
  };

  // Add new order
  const handleAdd = async () => {
    const formData = {
      ...form,
      createdAt: form.createdAt ? new Date(form.createdAt) : new Date(), // Convert to Date
    };
    await addOrder(formData);
    setForm({ stripeId: '', price: 0, eventId: '', buyerId: '', status: '', eventTitle: '', createdAt: '' });
    fetchOrders();
  };

  // Edit an existing order
  const handleEdit = (item: Order) => {
    setForm({
      stripeId: item.stripeId || '',
      price: item.price || 0,
      eventId: item.eventId || '',
      buyerId: item.buyerId || '',
      status: item.status || '',
      eventTitle: item.eventTitle || '', // Added missing property
      createdAt: item.createdAt ? new Date(item.createdAt).toISOString().split('T')[0] : '', // Format for date input
    });
    setCurrentId(item.id || '');
    setIsEditing(true);
  };

  // Update order details
  const handleUpdate = async () => {
    const formData = {
      ...form,
      createdAt: form.createdAt ? new Date(form.createdAt) : new Date(), // Convert to Date
    };
    await updateOrder(currentId, formData);
    setForm({ stripeId: '', price: 0, eventId: '', buyerId: '', status: '', eventTitle: '', createdAt: '' });
    setIsEditing(false);
    fetchOrders();
  };

  // Delete an order
  const handleDelete = async (id: string | undefined) => {
    if (id) {
      await deleteOrder(id);
      fetchOrders();
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [handleDelete, handleUpdate, handleAdd]);

  return (
    <>
      <div className="grid grid-cols-[200px_1fr] md:grid-cols-[300px_1fr] h-screen">
        <DashNav />
        <main className="p-4 overflow-auto">
          {data.length > 0 ? (
            <div className="container mt-5">
              <h2 className="mb-4">Orders Table</h2>
              <table className="table table-hover table-striped">
                <thead className="table-dark">
                  <tr>
                    <th>ID</th>
                    <th>Stripe ID</th>
                    <th>Event Title</th>
                    <th>Event ID</th>
                    <th>Buyer ID</th>
                    <th>Price</th>
                    <th>Status</th>
                    <th>Date of Payment</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {data.map((item) => (
                    <tr key={item.id}>
                      <th scope="row">{item.id}</th>
                      <td>{item.stripeId}</td>
                      <td>{item.eventTitle}</td>
                      <td>{item.eventId}</td>
                      <td>{item.buyerId}</td>
                      <td>{item.price}</td>
                      <td>{item.status}</td>
                      <td>{item.createdAt ? new Date(item.createdAt).toLocaleDateString() : 'N/A'}</td>
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
                      name="stripeId"
                      className="form-control"
                      placeholder="Stripe ID"
                      value={form.stripeId}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="col-md-3">
                    <input
                      type="text"
                      name="eventId"
                      className="form-control"
                      placeholder="Event ID"
                      value={form.eventId}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="col-md-3">
                    <input
                      type="text"
                      name="buyerId"
                      className="form-control"
                      placeholder="Buyer ID"
                      value={form.buyerId}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="col-md-3">
                    <input
                      type="number"
                      name="price"
                      className="form-control"
                      placeholder="Price"
                      value={form.price}
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
                      type="text"
                      name="eventTitle"
                      className="form-control"
                      placeholder="Event Title"
                      value={form.eventTitle}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="col-md-3">
                    <input
                      type="date"
                      name="createdAt"
                      className="form-control"
                      placeholder="Date of Payment"
                      value={form.createdAt}
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
              <h3 className="p-bold-20 md:h5-bold">No orders found</h3>
              <p className="p-regular-14">Come back later</p>
            </div>
          )}
        </main>
      </div>
    </>
  );
};

export default Page;