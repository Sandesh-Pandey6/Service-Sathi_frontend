import { useState, useRef, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { 
  User, Mail, Lock, Eye, EyeOff, ShieldCheck, Loader2, MapPin, 
  Check, Briefcase, Camera, UploadCloud, X, FileText, CheckCircle2
} from 'lucide-react';
import { authApi } from '@/lib/api';


type Step = 1 | 2 | 3 | 4;

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

/* ── File Upload Zone ── */
interface UploadZoneProps {
  label: string;
  required?: boolean;
  file: File | null;
  uploadedUrl: string | null;
  isUploading: boolean;
  onSelect: (file: File) => void;
  onRemove: () => void;
  accept?: string;
  maxMB?: number;
  icon?: React.ReactNode;
  hints?: string[];
  compact?: boolean;
}

function UploadZone({ label, required, file, uploadedUrl, isUploading, onSelect, onRemove, accept = 'image/jpeg,image/png,application/pdf', maxMB = 5, icon, hints, compact }: UploadZoneProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleClick = () => {
    if (!file && !uploadedUrl) inputRef.current?.click();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    if (f.size > maxMB * 1024 * 1024) {
      toast.error(`File must be under ${maxMB}MB`);
      return;
    }
    onSelect(f);
    e.target.value = '';
  };

  const isImage = file?.type?.startsWith('image/');
  const isPdf = file?.type === 'application/pdf';

  return (
    <div className="space-y-2">
      <label className="block text-[13px] font-bold text-slate-700">
        {label} {required && <span className="text-[#4338ca]">*</span>}
        {!required && <span className="text-gray-400 font-normal ml-1">(Optional but recommended)</span>}
      </label>
      <input ref={inputRef} type="file" accept={accept} className="hidden" onChange={handleChange} />

      {/* No file selected */}
      {!file && !uploadedUrl && (
        <div
          onClick={handleClick}
          className={`border-2 border-dashed border-gray-200 rounded-2xl hover:border-[#5b21b6] hover:bg-[#5b21b6]/5 transition-all cursor-pointer bg-white group ${compact ? 'p-6 flex flex-col items-center justify-center text-center py-6' : 'p-6 flex gap-6 items-center'}`}
        >
          {compact ? (
            <>
              <div className="w-10 h-10 bg-indigo-50 rounded-full flex items-center justify-center text-[#5b21b6] mb-3">
                <UploadCloud size={20} />
              </div>
              <h4 className="text-[14px] font-bold text-slate-800 mb-1">Click to upload</h4>
              <p className="text-[12px] text-slate-500">JPG, PNG or PDF • Max {maxMB}MB</p>
            </>
          ) : (
            <>
              <div className="w-16 h-20 bg-blue-50 border border-blue-100 rounded-lg flex flex-col items-center justify-center text-blue-400 group-hover:bg-white transition-colors shrink-0">
                {icon || <UploadCloud size={24} className="mb-1 text-blue-500" />}
                <span className="text-[10px] font-bold">Upload</span>
              </div>
              <div className="flex-1">
                <h4 className="text-[14px] font-bold text-slate-800 mb-1">Click to upload</h4>
                {hints ? (
                  <ul className="text-[12px] text-slate-500 space-y-0.5 list-disc list-inside marker:text-slate-300">
                    {hints.map((h, i) => <li key={i}>{h}</li>)}
                  </ul>
                ) : (
                  <p className="text-[12px] text-slate-500">JPG, PNG or PDF • Max {maxMB}MB</p>
                )}
              </div>
            </>
          )}
        </div>
      )}

      {/* File selected / uploaded — preview */}
      {(file || uploadedUrl) && (
        <div className="border-2 border-emerald-200 bg-emerald-50/40 rounded-2xl p-4 flex items-center gap-4 relative">
          {/* Thumbnail */}
          {isImage && file ? (
            <img src={URL.createObjectURL(file)} alt="preview" className="w-14 h-14 rounded-lg object-cover border border-gray-200 shrink-0" />
          ) : uploadedUrl && !isPdf ? (
            <img src={uploadedUrl} alt="uploaded" className="w-14 h-14 rounded-lg object-cover border border-gray-200 shrink-0" />
          ) : (
            <div className="w-14 h-14 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-400 shrink-0">
              <FileText size={24} />
            </div>
          )}

          <div className="flex-1 min-w-0">
            <p className="text-[13px] font-bold text-slate-800 truncate">{file?.name || 'Uploaded'}</p>
            <p className="text-[11px] text-slate-500">
              {file ? `${(file.size / 1024).toFixed(0)} KB` : ''}
              {uploadedUrl && !isUploading && <span className="text-emerald-600 font-bold ml-2"><Check size={14} className="inline mr-1" /> Uploaded</span>}
              {isUploading && <span className="text-[#5b21b6] font-bold ml-2">Uploading…</span>}
            </p>
          </div>

          {/* Remove button */}
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); onRemove(); }}
            className="w-7 h-7 rounded-full bg-red-100 hover:bg-red-200 text-red-500 flex items-center justify-center transition-colors shrink-0"
          >
            <X size={14} />
          </button>
        </div>
      )}
    </div>
  );
}

const CATEGORIES = [
  'Electrician', 'Plumber', 'Beautician', 'Mechanic', 'Carpenter', 
  'AC Repair', 'Appliance Repair', 'Painter', 'Cleaner', 'Gardener'
];

// Helper: upload a single document to the backend Cloudinary endpoint
async function uploadDocumentToCloud(file: File, docType: string): Promise<string> {
  const formData = new FormData();
  formData.append('document', file);
  formData.append('doc_type', docType);

  const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1';
  const res = await fetch(`${BASE_URL}/auth/upload-document`, {
    method: 'POST',
    body: formData,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Upload failed');
  return data.url;
}

export default function ProviderRegister() {
  const [step, setStep] = useState<Step>(1);
  const navigate = useNavigate();
  
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [bio, setBio] = useState('');

  // ── OTP State ──
  const [registeredEmail, setRegisteredEmail] = useState('');
  const [digits, setDigits] = useState(['', '', '', '', '', '']);
  const [resendTimer, setResendTimer] = useState(60);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // ── Document file state ──
  const [passportPhoto, setPassportPhoto] = useState<File | null>(null);
  const [passportPhotoUrl, setPassportPhotoUrl] = useState<string | null>(null);
  const [passportUploading, setPassportUploading] = useState(false);

  const [citizenshipFront, setCitizenshipFront] = useState<File | null>(null);
  const [citizenshipFrontUrl, setCitizenshipFrontUrl] = useState<string | null>(null);
  const [citizenFrontUploading, setCitizenFrontUploading] = useState(false);

  const [citizenshipBack, setCitizenshipBack] = useState<File | null>(null);
  const [citizenshipBackUrl, setCitizenshipBackUrl] = useState<string | null>(null);
  const [citizenBackUploading, setCitizenBackUploading] = useState(false);

  const [certificate, setCertificate] = useState<File | null>(null);
  const [certificateUrl, setCertificateUrl] = useState<string | null>(null);
  const [certUploading, setCertUploading] = useState(false);

  // Forms for different steps mapped manually or via useForm
  const { register, trigger, handleSubmit, formState: { errors }, watch } = useForm({
    defaultValues: { 
      fullName: '', 
      email: '', 
      phone: '', 
      password: '',
      terms: false,
      experience: '3-5 years',
      city: ''
    },
    mode: 'onTouched'
  });

  const watchTerms = watch('terms');

  // OTP Timer
  useEffect(() => {
    let t: ReturnType<typeof setInterval>;
    if (step === 4 && resendTimer > 0) t = setInterval(() => setResendTimer(p => p - 1), 1000);
    return () => clearInterval(t);
  }, [step, resendTimer]);

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
    const isValid = await trigger(['experience', 'city']);
    if (selectedCategories.length === 0) {
      toast.error('Please select at least one service category.');
      return;
    }
    if (!isValid) return;
    setStep(3);
  };

  // Upload a single file and update its URL state
  const handleFileUpload = async (
    file: File,
    docType: string,
    setUploading: (v: boolean) => void,
    setUrl: (v: string | null) => void,
  ) => {
    setUploading(true);
    try {
      const url = await uploadDocumentToCloud(file, docType);
      setUrl(url);
      toast.success(`${docType.replace(/_/g, ' ')} uploaded successfully!`);
    } catch (err: any) {
      toast.error(err.message || 'Upload failed');
      setUrl(null);
    } finally {
      setUploading(false);
    }
  };

  const onSubmitFinal = async (data: any) => {
    // Validate required documents
    if (!passportPhoto && !passportPhotoUrl) {
      toast.error('Please upload your passport size photo.');
      return;
    }
    if (!citizenshipFront && !citizenshipFrontUrl) {
      toast.error('Please upload citizenship front.');
      return;
    }
    if (!citizenshipBack && !citizenshipBackUrl) {
      toast.error('Please upload citizenship back.');
      return;
    }

    try {
      setIsLoading(true);

      // Upload files and get URLs immediately instead of relying on state
      let ppUrl = passportPhotoUrl;
      if (passportPhoto && !ppUrl) {
        setPassportUploading(true);
        ppUrl = await uploadDocumentToCloud(passportPhoto, 'passport_photo');
        setPassportPhotoUrl(ppUrl);
        setPassportUploading(false);
      }

      let cfUrl = citizenshipFrontUrl;
      if (citizenshipFront && !cfUrl) {
        setCitizenFrontUploading(true);
        cfUrl = await uploadDocumentToCloud(citizenshipFront, 'citizenship_front');
        setCitizenshipFrontUrl(cfUrl);
        setCitizenFrontUploading(false);
      }

      let cbUrl = citizenshipBackUrl;
      if (citizenshipBack && !cbUrl) {
        setCitizenBackUploading(true);
        cbUrl = await uploadDocumentToCloud(citizenshipBack, 'citizenship_back');
        setCitizenshipBackUrl(cbUrl);
        setCitizenBackUploading(false);
      }

      let certUrl = certificateUrl;
      if (certificate && !certUrl) {
        setCertUploading(true);
        certUrl = await uploadDocumentToCloud(certificate, 'certificate');
        setCertificateUrl(certUrl);
        setCertUploading(false);
      }

      // Register the provider
      await authApi.register({
        email: data.email,
        password: data.password,
        full_name: data.fullName,
        phone: data.phone,
        role: 'PROVIDER',
        categories: selectedCategories,
        experience: data.experience,
        city: data.city,
        bio: bio || undefined,
        documents: {
          passport_photo: ppUrl,
          citizenship_front: cfUrl,
          citizenship_back: cbUrl,
          certificate: certUrl || undefined,
        }
      });
      toast.success('Registration successful! Please verify your email.');
      setRegisteredEmail(data.email);
      setStep(4); // Go to OTP step
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to submit application');
    } finally {
      setIsLoading(false);
    }
  };

  /* OTP Handlers */
  const handleDigitChange = (val: string, idx: number) => {
    const clean = val.replace(/\D/g, '').slice(-1);
    const next = [...digits];
    next[idx] = clean;
    setDigits(next);
    if (clean && idx < 5) inputRefs.current[idx + 1]?.focus();
  };
  const handleDigitKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, idx: number) => {
    if (e.key === 'Backspace' && !digits[idx] && idx > 0) inputRefs.current[idx - 1]?.focus();
  };

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const otp = digits.join('');
    if (otp.length !== 6) { toast.error('Enter all 6 digits'); return; }
    try {
      setIsLoading(true);
      await authApi.verifyOtp({ email: registeredEmail, otp });
      toast.success('Email verified! You will be notified once an admin approves your account.');
      navigate('/login');
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to verify OTP');
    } finally { setIsLoading(false); }
  };

  const handleResendOtp = async () => {
    if (resendTimer > 0) return;
    try {
      setIsLoading(true);
      await authApi.resendOtp({ email: registeredEmail });
      toast.success('A new verification code has been sent.');
      setResendTimer(60);
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to resend OTP');
    } finally { setIsLoading(false); }
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

  const inputClass = `w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 outline-none text-sm text-slate-800 transition-all focus:ring-4 focus:ring-[#5b21b6]/20 focus:border-[#5b21b6]`;

  return (
    <div className="min-h-screen grid lg:grid-cols-12 bg-white font-sans overflow-x-hidden">
      
      {/* ── LEFT SIDEBAR ── */}
      <div className="hidden lg:flex flex-col col-span-4 p-12 xl:p-16 bg-[#3730A3] text-white relative h-screen overflow-y-auto">
        {/* Top Pill / Logo Area */}
        <div className="mb-20 flex flex-col items-start cursor-pointer" onClick={() => navigate('/')}>
          <div className="flex items-center gap-2 font-bold mb-8">
            <img src="/provider-logo.png" alt="Service Sathi" className="w-8 h-8 rounded object-contain" />
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
          <img src="/provider-logo.png" alt="Service Sathi" className="w-7 h-7 rounded object-contain" />
          <span className="text-lg text-slate-900 tracking-tight">Service<span className="text-[#5b21b6]">Sathi</span></span>
        </div>

        <div className="flex-1 flex flex-col items-center px-4 py-8 sm:px-12 lg:py-12 mx-auto w-full max-w-[640px]">
          
          {/* Top Pill Mobile & Center Label */}
          <div className="mb-10 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 text-[#5b21b6] text-xs font-bold border border-blue-100 shadow-sm mx-auto">
              <Briefcase size={14} /> Signing up as a Service Provider
            </div>
          </div>

          {step !== 4 && renderStepper()}

          {/* STEP 1: ACCOUNT  */}
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
                    {...register('password', { 
                      required: 'Password is required', 
                      minLength: { value: 8, message: 'Minimum 8 characters' },
                      pattern: { value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).*$/, message: 'Must include uppercase, lowercase, number and special character' }
                    })}
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


          {/*  STEP 2: PROFESSIONAL INFO */}
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
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none text-sm text-slate-800 transition-all focus:ring-4 focus:ring-[#5b21b6]/20 focus:border-[#5b21b6] resize-none"
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


          {/* STEP 3: DOCUMENTS  */}
          {step === 3 && (
            <div className="w-full animate-in fade-in slide-in-from-right-4 duration-300 max-w-[540px] mx-auto pb-12">
              <div className="mb-8">
                <h2 className="text-[28px] font-extrabold text-slate-900 mb-1 tracking-tight">Upload documents</h2>
                <p className="text-[14px] font-medium text-slate-500">
                  Required for verification — your documents are kept secure
                </p>
              </div>

              <form onSubmit={handleSubmit(onSubmitFinal)} className="space-y-6">
                
                {/* Upload Blocks — now functional */}
                <UploadZone
                  label="Passport Size Photo"
                  required
                  file={passportPhoto}
                  uploadedUrl={passportPhotoUrl}
                  isUploading={passportUploading}
                  onSelect={(f) => { setPassportPhoto(f); handleFileUpload(f, 'passport_photo', setPassportUploading, setPassportPhotoUrl); }}
                  onRemove={() => { setPassportPhoto(null); setPassportPhotoUrl(null); }}
                  accept="image/jpeg,image/png"
                  maxMB={2}
                  icon={<><Camera size={24} className="mb-1 text-blue-500"/><span className="text-[10px] font-bold">Photo</span></>}
                  hints={['White or light background', 'Face clearly visible, no sunglasses', '35mm × 45mm (or equivalent)', 'JPG or PNG • Max 2MB']}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <UploadZone
                    label="Citizenship (Front)"
                    required
                    file={citizenshipFront}
                    uploadedUrl={citizenshipFrontUrl}
                    isUploading={citizenFrontUploading}
                    onSelect={(f) => { setCitizenshipFront(f); handleFileUpload(f, 'citizenship_front', setCitizenFrontUploading, setCitizenshipFrontUrl); }}
                    onRemove={() => { setCitizenshipFront(null); setCitizenshipFrontUrl(null); }}
                    compact
                  />

                  <UploadZone
                    label="Citizenship (Back)"
                    required
                    file={citizenshipBack}
                    uploadedUrl={citizenshipBackUrl}
                    isUploading={citizenBackUploading}
                    onSelect={(f) => { setCitizenshipBack(f); handleFileUpload(f, 'citizenship_back', setCitizenBackUploading, setCitizenshipBackUrl); }}
                    onRemove={() => { setCitizenshipBack(null); setCitizenshipBackUrl(null); }}
                    compact
                  />
                </div>

                <UploadZone
                  label="Skill Certificate / Trade License"
                  required={false}
                  file={certificate}
                  uploadedUrl={certificateUrl}
                  isUploading={certUploading}
                  onSelect={(f) => { setCertificate(f); handleFileUpload(f, 'certificate', setCertUploading, setCertificateUrl); }}
                  onRemove={() => { setCertificate(null); setCertificateUrl(null); }}
                  compact
                />

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

          {/* ────── STEP 4: OTP VERIFICATION ────── */}
          {step === 4 && (
            <div className="w-full flex flex-col justify-center animate-in fade-in zoom-in-95 duration-500 py-10 pb-16">
              <div className="text-center mb-8">
                <div className="w-16 h-16 rounded-full mx-auto bg-[#5b21b6]/10 text-[#5b21b6] flex items-center justify-center mb-6">
                  <CheckCircle2 size={32} />
                </div>
                <h2 className="text-[26px] font-extrabold text-slate-900 mb-2 tracking-tight">Verify Your Email</h2>
                <p className="text-[15px] text-slate-500 font-medium">
                  We've sent a 6-digit code to<br/>
                  <span className="text-[#5b21b6] font-bold">{registeredEmail}</span>
                </p>
              </div>

              <form onSubmit={handleOtpSubmit} className="max-w-xs mx-auto w-full">
                <div className="flex justify-between gap-2 mb-8">
                  {digits.map((d, i) => (
                    <input
                      key={i}
                      ref={el => { inputRefs.current[i] = el; }}
                      type="text" inputMode="numeric" maxLength={1}
                      value={d}
                      onChange={e => handleDigitChange(e.target.value, i)}
                      onKeyDown={e => handleDigitKeyDown(e, i)}
                      className={`w-12 h-14 text-center text-xl font-bold bg-slate-50 border-2 rounded-xl focus:bg-white outline-none transition-all ${d ? 'border-[#5b21b6]' : 'border-gray-200'} focus:ring-4 focus:ring-[#5b21b6]/20 focus:border-[#5b21b6]`}
                    />
                  ))}
                </div>

                <button type="submit" disabled={isLoading || digits.join('').length !== 6} className={`w-full py-3.5 rounded-xl text-[15px] font-bold text-white shadow-md ${digits.join('').length === 6 ? 'bg-[#5b21b6] hover:scale-[1.02]' : 'bg-gray-300 cursor-not-allowed'} transition-all flex items-center justify-center gap-2`}>
                  {isLoading ? <Loader2 size={18} className="animate-spin" /> : 'Verify Email'}
                </button>

                <p className="text-center mt-6 text-[13px] font-medium text-slate-500">
                  Didn't receive the code?{' '}
                  <button type="button" onClick={handleResendOtp} disabled={resendTimer > 0 || isLoading} className={`font-bold ${resendTimer > 0 ? 'text-gray-400 cursor-not-allowed' : 'text-[#5b21b6] hover:underline'}`}>
                    {resendTimer > 0 ? `Resend in ${resendTimer}s` : 'Resend Code'}
                  </button>
                </p>
              </form>
            </div>
          )}

          {/* Footer Auth Link */}
          {step === 1 && (
            <p className="m-auto text-[13.5px] font-medium text-slate-500 pb-12 w-full text-center mt-16">
              Already have an account?{' '}
              <Link to="/login" className={`text-[#5b21b6] font-extrabold hover:underline`}>Sign in</Link>
            </p>
          )}
          {(step === 2 || step === 3) && (
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
