import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { 
  User, Mail, Lock, Eye, EyeOff, ShieldCheck, Loader2, MapPin, 
  Check, Briefcase, Camera, UploadCloud, Hexagon 
} from 'lucide-react';
import { authApi } from '@/lib/api';

type Step = 1 | 2 | 3;

/* ── Form Input Wrapper ── */
function Field({ label, required = true, icon, error, children, rightContext }: { label: string, required?: boolean, icon?: React.ReactNode, error?: string, children: React.ReactNode, rightContext?: React.ReactNode }) {
  return (
    <div className="mb-4">
      <label className="block text-[13px] font-bold text-slate-700 mb-1.5">
        {label} {required && <span className="text-[#4338ca]">*</span>}
      </label>
      <div className="relative flex items-center">
        {icon && (
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none flex items-center z-10">
            {icon}
          </span>
        )}
        {children}
        {rightContext && (
          <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 flex items-center">
            {rightContext}
          </span>
        )}
      </div>
      {error && <p className="text-red-500 text-xs mt-1.5 font-medium">{error}</p>}
    </div>
  );
}

const CATEGORIES = [
  'Electrician', 'Plumber', 'Beautician', 'Mechanic', 'Carpenter', 
  'AC Repair', 'Appliance Repair', 'Painter', 'Cleaner', 'Gardener'
];

export default function ProviderRegister() {
  const [step, setStep] = useState<Step>(1);
  const navigate = useNavigate();
  
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [bio, setBio] = useState('');

  // Forms for different steps mapped manually or via useForm
  const { register, trigger, handleSubmit, formState: { errors }, watch } = useForm({
    defaultValues: { 
      fullName: '', 
      email: '', 
      phone: '', 
      password: '',
      terms: false,
      experience: '3-5 years',
      hourlyRate: '0',
      city: ''
    },
    mode: 'onTouched'
  });

  const watchTerms = watch('terms');

  const onNextStep1 = async () => {
    const isValid = await trigger(['fullName', 'email', 'phone', 'password', 'terms']);
    if (!isValid) return;
    if (!watchTerms) {
      toast.error('Please agree to the Terms to continue.');
      return;
    }
    setStep(2);
  };

  const onNextStep2 = async () => {
    const isValid = await trigger(['experience', 'hourlyRate', 'city']);
    if (selectedCategories.length === 0) {
      toast.error('Please select at least one service category.');
      return;
    }
    if (!isValid) return;
    setStep(3);
  };

  const onSubmitFinal = async (data: any) => {
    // Collect all data + state to submit
    const payload = {
      role: 'PROVIDER',
      fullName: data.fullName,
      email: data.email,
      phone: data.phone,
      password: data.password,
      categories: selectedCategories,
      experience: data.experience,
      hourlyRate: data.hourlyRate,
      city: data.city,
      bio: bio
      // Photos & docs would traditionally be uploaded here via FormData
    };
    
    console.log("Submitting payload:", payload);

    try {
      setIsLoading(true);
      // For now we mock the API submission via authApi which registers the user
      await authApi.register({
        email: data.email,
        password: data.password,
        full_name: data.fullName,
        phone: data.phone,
        role: 'PROVIDER'
      });
      toast.success('Registration successful! Your application is under review.');
      navigate('/login');
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to submit application');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleCategory = (cat: string) => {
    setSelectedCategories(prev => 
      prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]
    );
  };

  const renderStepper = () => (
    <div className="flex items-center justify-center gap-4 mb-10 w-full max-w-sm mx-auto">
      {/* Step 1 */}
      <div className="flex flex-col items-center gap-2">
        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shadow-sm transition-colors ${step >= 1 ? 'bg-emerald-500 text-white' : 'bg-gray-200 text-gray-500'}`}>
          {step > 1 ? <Check size={16} strokeWidth={3} /> : '1'}
        </div>
        <span className={`text-[12px] font-bold ${step >= 1 ? 'text-emerald-500' : 'text-gray-400'}`}>Account</span>
      </div>
      
      <div className={`flex-1 h-px -mt-6 ${step >= 2 ? 'bg-emerald-500' : 'bg-gray-200'}`}></div>
      
      {/* Step 2 */}
      <div className="flex flex-col items-center gap-2">
        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shadow-sm transition-colors ${step >= 2 ? 'bg-[#5b21b6] text-white' : 'bg-gray-200 text-gray-500'}`}>
          {step > 2 ? <Check size={16} strokeWidth={3} /> : '2'}
        </div>
        <span className={`text-[12px] font-bold ${step >= 2 ? 'text-[#5b21b6]' : 'text-gray-400'}`}>Professional Info</span>
      </div>

      <div className={`flex-1 h-px -mt-6 ${step >= 3 ? 'bg-[#5b21b6]' : 'bg-gray-200'}`}></div>
      
      {/* Step 3 */}
      <div className="flex flex-col items-center gap-2">
        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shadow-sm transition-colors ${step >= 3 ? 'bg-[#5b21b6] text-white' : 'bg-gray-200 text-gray-500'}`}>
           3
        </div>
        <span className={`text-[12px] font-bold ${step >= 3 ? 'text-[#5b21b6]' : 'text-gray-400'}`}>Documents</span>
      </div>
    </div>
  );

  const inputClass = `w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 outline-none text-sm text-slate-800 transition-shadow transition-colors focus:ring-4 focus:ring-[#5b21b6]/20 focus:border-[#5b21b6]`;
  const plainInputClass = `w-full px-4 py-2.5 rounded-xl border border-gray-200 outline-none text-sm text-slate-800 transition-shadow transition-colors focus:ring-4 focus:ring-[#5b21b6]/20 focus:border-[#5b21b6]`;

  return (
    <div className="min-h-screen grid lg:grid-cols-12 bg-white font-sans overflow-x-hidden">
      
      {/* ── LEFT SIDEBAR ── */}
      <div className="hidden lg:flex flex-col col-span-4 p-12 xl:p-16 bg-[#3730A3] text-white relative h-screen overflow-y-auto">
        {/* Top Pill / Logo Area */}
        <div className="mb-20 flex flex-col items-start cursor-pointer" onClick={() => navigate('/')}>
          <div className="flex items-center gap-2 font-bold mb-8">
            <div className="bg-white rounded p-1 text-[#3730A3] flex items-center justify-center w-8 h-8">
              <Hexagon fill="currentColor" stroke="none" className="w-5 h-5"/>
            </div>
            <span className="text-xl tracking-tight">Service<span className="text-[#ffdb4d]">Sathi</span></span>
          </div>
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 text-white/90 text-xs font-semibold border border-white/20">
            <Briefcase size={14} /> Service Provider Registration
          </div>
        </div>

        {/* Hero Copy */}
        <h1 className="text-[40px] xl:text-[46px] font-black mb-6 leading-tight tracking-tight drop-shadow-sm text-white">
          Grow your business with Service<span className="text-[#ffdb4d]">Sathi</span>
        </h1>
        <p className="text-white/80 mb-16 text-[15px] font-medium leading-relaxed drop-shadow-sm max-w-sm">
          Join 1,200+ verified professionals and connect with thousands of customers ready to book your services.
        </p>

        {/* Feature List */}
        <div className="space-y-8 flex-1 drop-shadow-sm">
          <div className="flex gap-4 items-start">
            <div className="w-7 h-7 rounded-full bg-white text-[#3730A3] flex items-center justify-center shrink-0 shadow-sm mt-0.5">
              <Check size={16} strokeWidth={3} />
            </div>
            <div>
              <h3 className="font-bold text-[16px] mb-1">Manage Bookings Easily</h3>
              <p className="text-[#a5b4fc] text-sm leading-snug">All your bookings and schedule in one dashboard.</p>
            </div>
          </div>
          <div className="flex gap-4 items-start">
             <div className="w-7 h-7 rounded-full bg-white text-[#3730A3] flex items-center justify-center shrink-0 shadow-sm mt-0.5">
              <Check size={16} strokeWidth={3} />
            </div>
            <div>
              <h3 className="font-bold text-[16px] mb-1">Reach More Customers</h3>
              <p className="text-[#a5b4fc] text-sm leading-snug">Get discovered by 8,500+ active users on the platform.</p>
            </div>
          </div>
          <div className="flex gap-4 items-start">
             <div className="w-7 h-7 rounded-full bg-white text-[#3730A3] flex items-center justify-center shrink-0 shadow-sm mt-0.5">
              <Check size={16} strokeWidth={3} />
            </div>
            <div>
              <h3 className="font-bold text-[16px] mb-1">Secure Payments</h3>
              <p className="text-[#a5b4fc] text-sm leading-snug">Get paid reliably through Khalti, eSewa, or bank.</p>
            </div>
          </div>
          <div className="flex gap-4 items-start">
             <div className="w-7 h-7 rounded-full bg-white text-[#3730A3] flex items-center justify-center shrink-0 shadow-sm mt-0.5">
              <Check size={16} strokeWidth={3} />
            </div>
            <div>
              <h3 className="font-bold text-[16px] mb-1">Build Your Reputation</h3>
              <p className="text-[#a5b4fc] text-sm leading-snug">Ratings and reviews help you stand out from the crowd.</p>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-white/10 text-xs font-medium text-[#a5b4fc] tracking-wide">
          © {new Date().getFullYear()} ServiceSathi Pvt. Ltd.
        </div>
      </div>


      {/* ── RIGHT MAIN FORM AREA ── */}
      <div className="col-span-12 lg:col-span-8 flex flex-col h-screen overflow-y-auto w-full relative">
        
        {/* Mobile Header (Hidden on Desktop) */}
        <div className="lg:hidden flex items-center p-6 pb-0 gap-2 font-bold cursor-pointer" onClick={() => navigate('/')}>
          <div className="bg-[#3730A3] rounded p-1 text-white flex items-center justify-center w-7 h-7">
             <Hexagon size={16} fill="currentColor" stroke="none"/>
          </div>
          <span className="text-lg text-slate-900 tracking-tight">Service<span className="text-[#5b21b6]">Sathi</span></span>
        </div>

        <div className="flex-1 flex flex-col items-center px-4 py-8 sm:px-12 lg:py-12 mx-auto w-full max-w-[640px]">
          
          {/* Top Pill Mobile & Center Label */}
          <div className="mb-10 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 text-[#5b21b6] text-xs font-bold border border-blue-100 shadow-sm mx-auto">
              <Briefcase size={14} /> Signing up as a Service Provider
            </div>
          </div>

          {renderStepper()}

          {/* ────── STEP 1: ACCOUNT ────── */}
          {step === 1 && (
            <div className="w-full animate-in fade-in slide-in-from-right-4 duration-300 max-w-[500px] mx-auto">
              <div className="mb-8">
                <h2 className="text-[28px] font-extrabold text-slate-900 mb-1 tracking-tight">Create your account</h2>
                <p className="text-[14px] font-medium text-slate-500">
                  Start your journey as a verified service professional
                </p>
              </div>

              <form onSubmit={(e) => { e.preventDefault(); onNextStep1(); }} className="space-y-4 text-left">
                
                <Field label="Full Name" icon={<User size={16}/>} error={errors.fullName?.message as string}>
                  <input
                    {...register('fullName', { required: 'Name is required' })}
                    placeholder="User"
                    className={`${inputClass} ${errors.fullName ? 'border-red-300 focus:border-red-500 focus:ring-red-200' : ''}`}
                  />
                </Field>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Field label="Email Address" icon={<Mail size={16}/>} error={errors.email?.message as string}>
                    <input
                      {...register('email', { required: 'Email is required', pattern: { value: /\S+@\S+\.\S+/, message: 'Invalid email' } })}
                      placeholder="predator.12294@gmail.com"
                      autoComplete="email"
                      className={`${inputClass} ${errors.email ? 'border-red-300' : ''}`}
                    />
                  </Field>

                  <div className="mb-4">
                    <label className="block text-[13px] font-bold text-slate-700 mb-1.5">Phone Number <span className="text-[#4338ca]">*</span></label>
                    <div className={`flex items-center rounded-xl border ${errors.phone ? 'border-red-300' : 'border-gray-200'} focus-within:ring-4 focus:ring-[#5b21b6]/20 focus-within:border-[#5b21b6] transition-shadow bg-white overflow-hidden`}>
                      <div className="flex items-center justify-center pl-4 pr-3 py-2.5 bg-gray-50 border-r border-gray-200 text-xs font-bold text-gray-800 select-none">
                        NP <span className="ml-1 opacity-70">+977</span>
                      </div>
                      <input
                        {...register('phone', { required: 'Phone is required' })}
                        placeholder="98432613"
                        inputMode="numeric"
                        className="w-full px-4 py-2.5 outline-none text-sm font-medium text-slate-800 bg-transparent"
                      />
                    </div>
                    {errors.phone && <p className="text-red-500 text-xs mt-1.5 font-medium">{errors.phone.message as string}</p>}
                  </div>
                </div>

                <Field 
                  label="Password" 
                  icon={<Lock size={16}/>} 
                  error={errors.password?.message as string}
                  rightContext={
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="focus:outline-none hover:text-slate-600 transition-colors">
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  }
                >
                  <input
                    type={showPassword ? 'text' : 'password'}
                    {...register('password', { required: 'Password is required', minLength: { value: 8, message: 'Minimum 8 characters' } })}
                    placeholder="Create a strong password"
                    className={`${inputClass} pr-10 ${errors.password ? 'border-red-300' : ''}`}
                  />
                </Field>

                <div className="pt-2 mb-2 flex items-start gap-3">
                   <div className="flex items-center h-5">
                      <input
                        type="checkbox"
                        {...register('terms')}
                        className="w-4 h-4 border-gray-300 rounded text-[#5b21b6] focus:ring-[#5b21b6]"
                      />
                   </div>
                   <div className="text-xs text-slate-600 font-medium leading-relaxed">
                     I agree to the <a href="#" className="text-[#5b21b6] hover:underline">Terms of Service</a>, <a href="#" className="text-[#5b21b6] hover:underline">Privacy Policy</a> and <a href="#" className="text-[#5b21b6] hover:underline">Provider Agreement</a>
                   </div>
                </div>

                <button type="submit" className={`w-full py-3.5 rounded-xl text-[15px] font-bold text-white shadow-lg bg-[#5b21b6] transition-transform hover:scale-[1.02] hover:bg-[#4c1d95] flex items-center justify-center gap-2 mt-4`}>
                  Continue <span className="text-lg leading-none">&rarr;</span>
                </button>
              </form>
            </div>
          )}


          {/* ────── STEP 2: PROFESSIONAL INFO ────── */}
          {step === 2 && (
            <div className="w-full animate-in fade-in slide-in-from-right-4 duration-300 max-w-[540px] mx-auto">
              <div className="mb-8">
                <h2 className="text-[28px] font-extrabold text-slate-900 mb-1 tracking-tight">Professional details</h2>
                <p className="text-[14px] font-medium text-slate-500">
                  Tell customers about your skills and experience
                </p>
              </div>

              <form onSubmit={(e) => { e.preventDefault(); onNextStep2(); }} className="space-y-6">
                
                {/* Categories */}
                <div>
                  <label className="block text-[13px] font-bold text-slate-700 mb-2">Service Categories <span className="text-[#4338ca]">*</span></label>
                  <p className="text-xs text-slate-400 mb-3">Select all that apply</p>
                  <div className="flex flex-wrap gap-2.5">
                    {CATEGORIES.map(cat => (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => toggleCategory(cat)}
                        className={`px-4 py-2 rounded-full text-xs font-bold border transition-all duration-200 ${
                          selectedCategories.includes(cat) 
                            ? 'bg-[#5b21b6] border-[#5b21b6] text-white shadow-md' 
                            : 'bg-white border-gray-200 text-slate-600 hover:border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Field label="Years of Experience" icon={<Briefcase size={16}/>}>
                    <select 
                      {...register('experience')}
                      className={`${inputClass} appearance-none cursor-pointer pr-10`}
                    >
                      <option value="0-1 years">0-1 years</option>
                      <option value="1-3 years">1-3 years</option>
                      <option value="3-5 years">3-5 years</option>
                      <option value="5-10 years">5-10 years</option>
                      <option value="10+ years">10+ years</option>
                    </select>
                  </Field>

                  <div className="mb-4">
                     <label className="block text-[13px] font-bold text-slate-700 mb-1.5">Hourly Rate (Rs.)</label>
                     <div className="relative">
                        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 font-bold text-sm">Rs</span>
                        <input
                          type="number"
                          {...register('hourlyRate')}
                          placeholder="0"
                          className={`${plainInputClass} pl-10 pr-12`}
                        />
                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 font-medium text-sm">/hr</span>
                     </div>
                  </div>
                </div>

                <Field label="City / Service Area" icon={<MapPin size={16}/>} rightContext={<span className="pointer-events-none"><Check size={14} className="opacity-0"/></span>}>
                  <select 
                    {...register('city', { required: 'City is required' })}
                    className={`${inputClass} appearance-none cursor-pointer ${errors.city ? 'border-red-300' : ''}`}
                  >
                    <option value="" disabled>Select your primary city</option>
                    <option value="Kathmandu">Kathmandu</option>
                    <option value="Lalitpur">Lalitpur</option>
                    <option value="Bhaktapur">Bhaktapur</option>
                    <option value="Pokhara">Pokhara</option>
                    <option value="Chitwan">Chitwan</option>
                  </select>
                </Field>

                <div className="mb-4">
                  <div className="flex justify-between items-end mb-1.5">
                    <label className="block text-[13px] font-bold text-slate-700">Bio / About You</label>
                    <span className="text-[11px] font-medium text-slate-400">({bio.length}/300)</span>
                  </div>
                  <textarea
                    value={bio}
                    onChange={(e) => setBio(e.target.value.substring(0, 300))}
                    placeholder="Tell us a bit about your professional background and why customers should hire you..."
                    rows={4}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none text-sm text-slate-800 transition-shadow transition-colors focus:ring-4 focus:ring-[#5b21b6]/20 focus:border-[#5b21b6] resize-none"
                  />
                </div>

                <div className="flex gap-3 pt-2">
                  <button type="button" onClick={() => setStep(1)} className="w-14 flex items-center justify-center py-3.5 rounded-xl border border-gray-200 font-bold hover:bg-gray-50 text-slate-600 transition-colors">
                     &larr;
                  </button>
                  <button type="submit" className={`flex-1 py-3.5 rounded-xl text-[15px] font-bold text-white shadow-lg bg-[#5b21b6] transition-transform hover:scale-[1.02] hover:bg-[#4c1d95] flex items-center justify-center gap-2`}>
                    Continue <span className="text-lg leading-none">&rarr;</span>
                  </button>
                </div>
              </form>
            </div>
          )}


          {/* ────── STEP 3: DOCUMENTS ────── */}
          {step === 3 && (
            <div className="w-full animate-in fade-in slide-in-from-right-4 duration-300 max-w-[540px] mx-auto pb-12">
              <div className="mb-8">
                <h2 className="text-[28px] font-extrabold text-slate-900 mb-1 tracking-tight">Upload documents</h2>
                <p className="text-[14px] font-medium text-slate-500">
                  Required for verification — your documents are kept secure
                </p>
              </div>

              <form onSubmit={handleSubmit(onSubmitFinal)} className="space-y-6">
                
                {/* Upload Blocks */}
                <div className="space-y-2">
                   <label className="block text-[13px] font-bold text-slate-700">Passport Size Photo <span className="text-[#4338ca]">*</span></label>
                   <div className="border-2 border-dashed border-gray-200 rounded-2xl p-6 hover:border-[#5b21b6] hover:bg-[#5b21b6]/5 transition-all cursor-pointer flex gap-6 items-center bg-white group">
                      <div className="w-16 h-20 bg-blue-50 border border-blue-100 rounded-lg flex flex-col items-center justify-center text-blue-400 group-hover:bg-white transition-colors shrink-0">
                         <Camera size={24} className="mb-1 text-blue-500"/>
                         <span className="text-[10px] font-bold">Photo</span>
                      </div>
                      <div className="flex-1">
                         <h4 className="text-[14px] font-bold text-slate-800 mb-1">Upload passport size photo</h4>
                         <ul className="text-[12px] text-slate-500 space-y-0.5 list-disc list-inside marker:text-slate-300">
                           <li>White or light background</li>
                           <li>Face clearly visible, no sunglasses</li>
                           <li>35mm × 45mm (or equivalent)</li>
                           <li>JPG or PNG • Max 2MB</li>
                         </ul>
                      </div>
                   </div>
                </div>

                <div className="space-y-2">
                   <label className="block text-[13px] font-bold text-slate-700">Citizenship Card / National ID <span className="text-[#4338ca]">*</span></label>
                   <div className="border-2 border-dashed border-gray-200 rounded-2xl p-6 hover:border-[#5b21b6] hover:bg-[#5b21b6]/5 transition-all cursor-pointer flex flex-col items-center justify-center bg-white text-center py-8">
                      <div className="w-10 h-10 bg-indigo-50 rounded-full flex items-center justify-center text-[#5b21b6] mb-3">
                         <UploadCloud size={20} />
                      </div>
                      <h4 className="text-[14px] font-bold text-slate-800 mb-1">Click to upload</h4>
                      <p className="text-[12px] text-slate-500">JPG, PNG or PDF • Max 5MB</p>
                   </div>
                </div>

                <div className="space-y-2">
                   <label className="block text-[13px] font-bold text-slate-700">Skill Certificate / Trade License <span className="text-gray-400 font-normal ml-1">(Optional but recommended)</span></label>
                   <div className="border-2 border-dashed border-gray-200 rounded-2xl p-6 hover:border-[#5b21b6] hover:bg-[#5b21b6]/5 transition-all cursor-pointer flex flex-col items-center justify-center bg-white text-center py-8">
                      <div className="w-10 h-10 bg-indigo-50 rounded-full flex items-center justify-center text-[#5b21b6] mb-3">
                         <UploadCloud size={20} />
                      </div>
                      <h4 className="text-[14px] font-bold text-slate-800 mb-1">Click to upload certificate</h4>
                      <p className="text-[12px] text-slate-500">JPG, PNG or PDF • Max 5MB</p>
                   </div>
                </div>

                {/* Safe Banner */}
                <div className="bg-blue-50/50 border border-blue-100 rounded-xl p-4 flex gap-3 mt-6 items-start">
                  <ShieldCheck size={20} className="text-blue-500 shrink-0" />
                  <div>
                    <h4 className="text-[13px] font-bold text-slate-800 mb-0.5">Your data is safe with us</h4>
                    <p className="text-[12px] font-medium leading-relaxed text-blue-900/70">
                      Documents are encrypted and used only for identity verification. <span className="text-[#5b21b6]">They will never be shared with customers.</span>
                    </p>
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <button type="button" onClick={() => setStep(2)} className="w-14 flex items-center justify-center py-3.5 rounded-xl border border-gray-200 font-bold hover:bg-gray-50 text-slate-600 transition-colors">
                     &larr;
                  </button>
                  <button type="submit" disabled={isLoading} className={`flex-1 py-3.5 rounded-xl text-[15px] font-bold text-white shadow-lg transition-transform ${isLoading ? 'bg-[#93c5fd] cursor-not-allowed' : 'bg-[#93c5fd] hover:scale-[1.02] hover:bg-blue-300 text-blue-900'} flex items-center justify-center gap-2`}>
                    {isLoading ? <><Loader2 size={16} className="animate-spin text-[#5b21b6]" /> Submitting...</> : <>Submit Application <span className="text-lg leading-none">&rarr;</span></>}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Footer Auth Link */}
          {step === 1 && (
            <p className="m-auto mt-16 text-[13.5px] font-medium text-slate-500">
              Already have an account?{' '}
              <Link to="/login" className={`text-[#5b21b6] font-extrabold hover:underline`}>Sign in</Link>
            </p>
          )}
          {step > 1 && (
            <div className="pb-12 text-center w-full">
              <p className="text-[13.5px] font-medium text-slate-500 mt-6">
                Already have an account?{' '}
                <Link to="/login" className={`text-[#5b21b6] font-extrabold hover:underline`}>Sign in</Link>
              </p>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
