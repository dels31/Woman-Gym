import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { WA_NUMBER } from '../../lib/constants';

const formSchema = z.object({
  nama: z.string().min(2, 'Nama minimal 2 karakter'),
  nomor_hp: z.string().regex(/^(08|\+62)\d{8,12}$/, 'Format nomor HP tidak valid (mulai 08 atau +62)'),
  pesan: z.string().min(10, 'Pesan minimal 10 karakter')
});

type FormData = z.infer<typeof formSchema>;

export default function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(formSchema)
  });

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    try {
      const text = `Halo, saya ${data.nama} ingin bertanya:\n\n${data.pesan}`;
      const waUrl = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(text)}`;
      window.open(waUrl, '_blank');
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="block text-sm font-bold text-brand-dark mb-2">Nama Lengkap *</label>
        <input {...register('nama')} className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-brand-primary focus:ring-2 focus:ring-brand-primary-light outline-none transition-all" placeholder="Nama Anda" />
        {errors.nama && <p className="text-brand-error text-xs mt-1">{errors.nama.message}</p>}
      </div>
      
      <div>
        <label className="block text-sm font-bold text-brand-dark mb-2">Nomor WhatsApp *</label>
        <input {...register('nomor_hp')} className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-brand-primary focus:ring-2 focus:ring-brand-primary-light outline-none transition-all" placeholder="08123456789" />
        {errors.nomor_hp && <p className="text-brand-error text-xs mt-1">{errors.nomor_hp.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-bold text-brand-dark mb-2">Pesan *</label>
        <textarea {...register('pesan')} rows={4} className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-brand-primary focus:ring-2 focus:ring-brand-primary-light outline-none transition-all leading-relaxed" placeholder="Tuliskan pertanyaan Anda..." />
        {errors.pesan && <p className="text-brand-error text-xs mt-1">{errors.pesan.message}</p>}
      </div>

      <button disabled={isSubmitting} type="submit" className="w-full bg-brand-primary text-white py-4 rounded-xl font-bold text-lg hover:bg-brand-primary-light shadow-brand-md transition-all mt-4">
        {isSubmitting ? 'Memproses...' : 'Kirim via WhatsApp'}
      </button>
    </form>
  );
}
