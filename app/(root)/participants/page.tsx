'use client';

import DashNav from '@/components/ui/shared/DashNav';
import { deleteParticipant, getParticipants } from '@/lib/actions/participant';
import { Participant } from '@/types';
import React, { useEffect, useState } from 'react';

const Page = () => {
  const [data, setData] = useState<Participant[]>([]);

  const fetchParticipants = async () => {
    const list = await getParticipants();
    setData(list);
  };
  const handleDelete = async(id:string|undefined) => {
    await deleteParticipant(id);
    fetchParticipants();
  };
  useEffect(() => {
    fetchParticipants();
  }, [handleDelete]);

  return (
    <div className="grid grid-cols-[200px_1fr] md:grid-cols-[300px_1fr] h-screen">
      <DashNav />
      <main className="p-4 overflow-auto">
        {data.length > 0 ? (
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
                  <th>action</th>
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
                    <td><button
                  className="btn btn-sm btn-danger"
                  onClick={() => handleDelete(item.id)}
                >
                  Delete
                </button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="flex-center wrapper min-h-[200px] w-full flex-col gap-3 rounded-[14px] alert alert-primary bg-grey-50 py-28 text-center">
            <h3 className="p-bold-20 md:h5-bold">No participant found</h3>
            <p className="p-regular-14">come back later</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default Page;
