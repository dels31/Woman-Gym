import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { WA_NUMBER } from '../../lib/constants';

const formSchema = z.object({
  nama_lengkap: z.string().min(2, 'Nama minimal 2 karakter'),
  nomor_hp: z.string().regex(/^(08|\+62)\d{8,12}$/, 'Format nomor HP tidak valid (mulai 08 atau +62)'),
  email: z.string().email('Format email tidak valid'),
  usia: z.number().min(15, 'Minimal usia 15 tahun'),
  alamat: z.string().optional(),
  paket_minat: z.enum(['trial', 'bulanan', '3-bulan', 'tahunan'], { required_error: 'Pilih paket peminatan' }),
  program_minat: z.array(z.string()).optional(),
  sumber_info: z.enum(['google', 'instagram', 'teman', 'lainnya'], { required_error: 'Pilih sumber info' }),
  pesan: z.string().optional()
});

type FormData = z.infer<typeof formSchema>;

export default function RegistrationForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [waLink, setWaLink] = useState('');

  const { register, handleSubmit, formState: { errors }, watch } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      program_minat: []
    }
  });

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    try {
      // API call placeholder for email sending
      await new Promise(resolve => setTimeout(resolve, 1500)); 
      
      const text = `Halo, saya baru mengisi form pendaftaran:\n\nNama: ${data.nama_lengkap}\nPaket: ${data.paket_minat}\nUsia: ${data.usia}\nInfo dari: ${data.sumber_info}${data.pesan ? `\n\nPesan:\n${data.pesan}` : ''}`;
      const waUrl = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(text)}`;
      setWaLink(waUrl);
      setIsSuccess(true);
    } catch (error) {
      console.error(error);
      alert('Terjadi kesalahan, silakan coba lagi.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="bg-green-50 text-center p-8 rounded-2xl border border-green-200 animate-in fade-in zoom-in duration-500">
        <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">✓</div>
        <h3 className="text-2xl font-display font-bold text-green-800 mb-2">Pendaftaran Berhasil!</h3>
        <p className="text-green-700 mb-6">Terima kasih {watch('nama_lengkap')}, data Anda telah kami terima.</p>
        <p className="text-sm text-green-600 mb-8 max-w-md mx-auto">Untuk mempercepat konfirmasi dan aktivasi, silakan klik tombol di bawah ini untuk mengirim pesan WhatsApp ke admin kami.</p>
        <a href={waLink} target="_blank" rel="noopener noreferrer" className="inline-block bg-[#25D366] text-white px-8 py-4 rounded-full font-bold shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all">
          Lanjut ke WhatsApp Admin
        </a>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 bg-white p-6 md:p-8 rounded-2xl shadow-brand-lg border border-gray-100">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-bold text-brand-dark mb-2">Nama Lengkap *</label>
          <input {...register('nama_lengkap')} className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-brand-primary focus:ring-2 focus:ring-brand-primary-light outline-none transition-all" placeholder="Misal: Andi Nisa" />
          {errors.nama_lengkap && <p className="text-brand-error text-xs mt-1">{errors.nama_lengkap.message}</p>}
        </div>
        
        <div>
          <label className="block text-sm font-bold text-brand-dark mb-2">Nomor HP/WhatsApp *</label>
          <input {...register('nomor_hp')} className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-brand-primary focus:ring-2 focus:ring-brand-primary-light outline-none transition-all" placeholder="08123456789" />
          {errors.nomor_hp && <p className="text-brand-error text-xs mt-1">{errors.nomor_hp.message}</p>}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-bold text-brand-dark mb-2">Email *</label>
          <input type="email" {...register('email')} className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-brand-primary focus:ring-2 focus:ring-brand-primary-light outline-none transition-all" placeholder="email@contoh.com" />
          {errors.email && <p className="text-brand-error text-xs mt-1">{errors.email.message}</p>}
        </div>
        
        <div>
          <label className="block text-sm font-bold text-brand-dark mb-2">Usia *</label>
          <input type="number" {...register('usia', { valueAsNumber: true })} className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-brand-primary focus:ring-2 focus:ring-brand-primary-light outline-none transition-all" placeholder="18" />
          {errors.usia && <p className="text-brand-error text-xs mt-1">{errors.usia.message}</p>}
        </div>
      </div>

      <div>
        <label className="block text-sm font-bold text-brand-dark mb-2">Paket Peminatan *</label>
        <select {...register('paket_minat')} className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-brand-primary focus:ring-2 focus:ring-brand-primary-light outline-none transition-all bg-white">
          <option value="">-- Pilih Paket --</option>
          <option value="trial">Trial Gratis 1 Hari</option>
          <option value="bulanan">Langganan Bulanan (Rp 250.000)</option>
          <option value="3-bulan">Langganan 3 Bulan (Rp 650.000)</option>
          <option value="tahunan">Langganan Tahunan</option>
        </select>
        {errors.paket_minat && <p className="text-brand-error text-xs mt-1">{errors.paket_minat.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-bold text-brand-dark mb-2">Darimana Anda mengetahui kami? *</label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {['google', 'instagram', 'teman', 'lainnya'].map((source) => (
            <label key={source} className="flex items-center space-x-2 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-brand-light transition-colors">
              <input type="radio" value={source} {...register('sumber_info')} className="text-brand-primary focus:ring-brand-primary" />
              <span className="capitalize text-sm text-brand-body">{source}</span>
            </label>
          ))}
        </div>
        {errors.sumber_info && <p className="text-brand-error text-xs mt-1">{errors.sumber_info.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-bold text-brand-dark mb-2">Alamat Domisili (Opsional)</label>
        <textarea {...register('alamat')} rows={3} className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-brand-primary focus:ring-2 focus:ring-brand-primary-light outline-none transition-all" placeholder="Alamat lengkap di Banjarmasin..." />
      </div>

      <button disabled={isSubmitting} type="submit" className="w-full bg-brand-primary text-white py-4 rounded-xl font-bold text-lg hover:bg-brand-primary-light shadow-brand-md transition-all disabled:opacity-50 disabled:cursor-not-allowed">
        {isSubmitting ? 'Memproses...' : 'Kirim Formulir Pendaftaran'}
      </button>
      <p className="text-center text-xs text-gray-500 mt-4">Dengan mengirimkan formulir ini, Anda menyetujui syarat & ketentuan kami.</p>
    </form>
  );
}
