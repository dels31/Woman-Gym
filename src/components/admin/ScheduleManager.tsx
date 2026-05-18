import React, { useEffect, useState } from 'react';
import { db, auth } from '../../lib/firebase';
import { collection, addDoc, updateDoc, deleteDoc, doc, onSnapshot, serverTimestamp } from 'firebase/firestore';
import { signInWithPopup, GoogleAuthProvider, signOut, onAuthStateChanged, User } from 'firebase/auth';
import { Trash2, Edit2, Plus, LogOut } from 'lucide-react';

enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  }
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

const daysOfWeek = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu'];

export default function ScheduleManager() {
  const [user, setUser] = useState<User | null>(null);
  const [schedules, setSchedules] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Form state
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    day: 'Senin',
    time: '16:00',
    class: '',
    trainer: '',
    duration: '60 Menit'
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!user) return;
    
    // Check if user is admin (email or just rely on firestore rules)
    // Firestore rules will reject writes if not admin.
    const unsubscribe = onSnapshot(collection(db, 'schedules'), (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      const dayOrder: Record<string, number> = { 'Senin': 1, 'Selasa': 2, 'Rabu': 3, 'Kamis': 4, 'Jumat': 5, 'Sabtu': 6, 'Minggu': 7 };
      
      data.sort((a: any, b: any) => {
        if (dayOrder[a.day] !== dayOrder[b.day]) return dayOrder[a.day] - dayOrder[b.day];
        return a.time.localeCompare(b.time);
      });
      
      setSchedules(data);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'schedules');
    });
    
    return () => unsubscribe();
  }, [user]);

  const login = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error(error);
      alert('Login failed');
    }
  };

  const logout = () => signOut(auth);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        await updateDoc(doc(db, 'schedules', editingId), {
          ...formData,
          updatedAt: serverTimestamp()
        });
        setEditingId(null);
      } else {
        await addDoc(collection(db, 'schedules'), {
          ...formData,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        });
      }
      setFormData({ day: 'Senin', time: '16:00', class: '', trainer: '', duration: '60 Menit' });
    } catch (error: any) {
      alert('Gagal menyimpan jadwal (Pastikan email Anda adalah admin: bapuk1331@gmail.com)\n\nError: ' + error.message);
      handleFirestoreError(error, OperationType.WRITE, 'schedules');
    }
  };

  const handleEdit = (schedule: any) => {
    setEditingId(schedule.id);
    setFormData({
      day: schedule.day,
      time: schedule.time,
      class: schedule.class,
      trainer: schedule.trainer,
      duration: schedule.duration || '60 Menit'
    });
  };

  const handleDelete = async (id: string) => {
    if (confirm('Yakin ingin menghapus jadwal ini?')) {
      try {
        await deleteDoc(doc(db, 'schedules', id));
      } catch (error) {
        alert('Gagal menghapus');
        handleFirestoreError(error, OperationType.DELETE, 'schedules');
      }
    }
  };

  if (loading) {
    console.log("ScheduleManager: loading");
    return <div className="text-center py-20">Loading...</div>;
  }

  if (!user) {
    console.log("ScheduleManager: not logged in");
    return (
      <div className="max-w-md mx-auto text-center py-20">
        <h2 className="text-2xl font-bold mb-6 text-brand-dark">Admin Login</h2>
        <p className="text-brand-body mb-8">Silakan login dengan akun Google Anda untuk mengelola jadwal kelas.</p>
        <button onClick={login} className="bg-brand-primary text-white px-8 py-3 rounded-xl font-bold shadow-brand-md hover:bg-brand-primary-light transition-colors">
          Login dengan Google
        </button>
      </div>
    );
  }

  console.log("ScheduleManager: logged in, rendering admin panel");
  return (
    <div className="max-w-6xl mx-auto py-12 px-4">
      <div className="flex justify-between items-center mb-8 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div>
          <h2 className="text-2xl font-bold text-brand-dark">CMS Jadwal Kelas</h2>
          <p className="text-sm text-brand-body mt-1">Logged in as {user.email}</p>
        </div>
        <button onClick={logout} className="flex items-center text-red-500 hover:text-red-700 font-medium">
          <LogOut size={18} className="mr-2" /> Logout
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 sticky top-24">
            <h3 className="font-bold text-lg mb-6 flex items-center border-b pb-4">
              <Plus size={20} className="mr-2 text-brand-primary" /> {editingId ? 'Edit Jadwal' : 'Tambah Jadwal Baru'}
            </h3>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-brand-dark mb-1">Hari</label>
                <select 
                  value={formData.day} 
                  onChange={e => setFormData({...formData, day: e.target.value})}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-brand-primary outline-none"
                  required
                >
                  {daysOfWeek.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-bold text-brand-dark mb-1">Jam (HH:MM)</label>
                <input 
                  type="time" 
                  value={formData.time} 
                  onChange={e => setFormData({...formData, time: e.target.value})}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-brand-primary outline-none"
                  required 
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-brand-dark mb-1">Nama Kelas</label>
                <input 
                  type="text" 
                  value={formData.class} 
                  placeholder="Contoh: Zumba Fiesta"
                  onChange={e => setFormData({...formData, class: e.target.value})}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-brand-primary outline-none"
                  required 
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-brand-dark mb-1">Trainer</label>
                <input 
                  type="text" 
                  value={formData.trainer} 
                  placeholder="Contoh: Coach Didi"
                  onChange={e => setFormData({...formData, trainer: e.target.value})}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-brand-primary outline-none"
                  required 
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-brand-dark mb-1">Durasi</label>
                <input 
                  type="text" 
                  value={formData.duration} 
                  placeholder="Contoh: 60 Menit"
                  onChange={e => setFormData({...formData, duration: e.target.value})}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-brand-primary outline-none"
                  required 
                />
              </div>

              <div className="pt-4 flex gap-2">
                <button type="submit" className="flex-1 bg-brand-primary text-white py-2 rounded-lg font-bold hover:bg-brand-primary-light transition-colors">
                  {editingId ? 'Simpan Perubahan' : 'Tambah Jadwal'}
                </button>
                {editingId && (
                  <button type="button" onClick={() => setEditingId(null)} className="px-4 py-2 bg-gray-100 text-gray-600 rounded-lg font-bold hover:bg-gray-200">
                    Batal
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h3 className="font-bold text-lg mb-6 border-b pb-4">Daftar Jadwal Saat Ini</h3>
            
            {schedules.length === 0 ? (
              <p className="text-gray-500 text-center py-8">Belum ada jadwal yang ditambahkan.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-gray-50 text-gray-600 text-sm">
                    <tr>
                      <th className="py-3 px-4 font-bold border-b">Hari</th>
                      <th className="py-3 px-4 font-bold border-b">Waktu</th>
                      <th className="py-3 px-4 font-bold border-b">Kelas</th>
                      <th className="py-3 px-4 font-bold border-b">Trainer</th>
                      <th className="py-3 px-4 font-bold border-b text-right">Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {schedules.map((s) => (
                      <tr key={s.id} className="border-b last:border-0 hover:bg-gray-50 transition-colors">
                        <td className="py-3 px-4 font-medium">{s.day}</td>
                        <td className="py-3 px-4 text-brand-body"><span className="bg-brand-primary-bg text-brand-primary px-2 py-1 rounded text-xs font-bold">{s.time}</span></td>
                        <td className="py-3 px-4 font-bold text-brand-dark">{s.class}</td>
                        <td className="py-3 px-4 text-brand-body">{s.trainer}</td>
                        <td className="py-3 px-4 flex justify-end gap-2">
                          <button onClick={() => handleEdit(s)} className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors">
                            <Edit2 size={16} />
                          </button>
                          <button onClick={() => handleDelete(s.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                            <Trash2 size={16} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
