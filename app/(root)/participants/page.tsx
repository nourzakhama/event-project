'use client';
import DashNav from '@/components/ui/shared/DashNav';
import { addParticipant, deleteParticipant, getParticipants, updateParticipant } from '@/lib/actions/participant';
import { Participant } from '@/types';
import React, { useEffect, useState } from 'react';
import { set } from 'zod';

const Page = () => {
  const [data, setData] = useState<Participant[]>([]);
  const [form, setForm] = useState({ cin: '', email: '',name:'', firstName: '' ,lastName:'',imageUrl:'',satisfaction:''});
  const [isEditing, setIsEditing] = useState(false);
  const[currentId,setCurrentId]=useState<string>('');

 
  const fetchParticipants=async()=>{
    const list=await getParticipants();
    setData(list);
  }


  

  const handleChange = (e:any) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleAdd =async () => {
   await addParticipant(form);
    setForm({ cin: '', email: '',name:'', firstName: '' ,lastName:'',imageUrl:'',satisfaction:''});
    fetchParticipants();
  };

  const handleEdit = (item:any) => {
    setForm(item);
    setCurrentId(item.id);
    setIsEditing(true);
  };

  const handleUpdate = async() => {
    await updateParticipant(currentId,form);
    setForm({ cin: '', email: '',name:'', firstName: '' ,lastName:'',imageUrl:'',satisfaction:''});
    setIsEditing(false);
    fetchParticipants();
  };

  const handleDelete = async(id:string|undefined) => {
    await deleteParticipant(id);
    fetchParticipants();
  };
  useEffect(()=>{
    fetchParticipants();

  },[handleDelete,handleUpdate,handleAdd])
  return (<>
   <div className="grid grid-cols-[200px_1fr] md:grid-cols-[300px_1fr] h-screen">
      <DashNav />
      <main className="p-4 overflow-auto">
  { data.length>0 ? (
    <div className="container mt-5">
      <h2 className="mb-4">Participants Table</h2>
      <table className="table table-hover table-striped">
        <thead className="table-dark">
          <tr>
            <th>id</th>
            <th>cin</th>
            <th>email</th>
            <th>userName</th>
            <th>firstName</th>
            <th>lastName</th>
            <th>photo profil</th>
            <th>satisfaction</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <tr key={item.id}>
                 
              <th scope="row">{item.id}</th>
              <td>{item.cin}</td>
              <td>{item.email}</td>
              <td>{item.name}</td>
              <td>{item.firstName}</td>
              <td>{item.lastName}</td>
              <td>{item.imageUrl}</td>
              <td>{item.satisfaction}</td>
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
              name="cin"
              className="form-control"
              placeholder="cin number"
              value={form.cin}
              onChange={handleChange}
            />
          </div>
          <div className="col-md-3">
            <input
              type="text"
              name="email"
              className="form-control"
              placeholder="email"
              value={form.email}
              onChange={handleChange}
            />
          </div>
          <div className="col-md-3">
            <input
              type="text"
              name="name"
              className="form-control"
              placeholder="name"
              value={form.name}
              onChange={handleChange}
            />
          </div>
          <div className="col-md-3">
            <input
              type="text"
              name="firstName"
              className="form-control"
              placeholder="firstName"
              value={form.firstName}
              onChange={handleChange}
            />
                   </div>
            <div className="col-md-3">
            <input
              type="text"
              name="lastName"
              className="form-control"
              placeholder="lastName"
              value={form.lastName}
              onChange={handleChange}
            />
          </div>
          <div className="col-md-3">
            <input
              type="text"
              name="imageUrl"
              className="form-control"
              placeholder="foto de profil"
              value={form.imageUrl}
              onChange={handleChange}
            />
          </div>
   
      
          <div className="col-md-3">
            <input
              type="text"
              name="satisfaction"
              className="form-control"
              placeholder="satisfait"
              value={form.satisfaction}
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
    </div>):(  // Affiche un état vide si aucune donnée n'est trouvée
        <div className="flex-center wrapper min-h-[200px] w-full flex-col gap-3 rounded-[14px] bg-grey-50 py-28 text-center">
          <h3 className="p-bold-20 md:h5-bold">No participant found</h3>
          <p className="p-regular-14">come back later</p>
        </div>
          )}
        </main>
        </div>
    </>

  );
};

export default Page;
