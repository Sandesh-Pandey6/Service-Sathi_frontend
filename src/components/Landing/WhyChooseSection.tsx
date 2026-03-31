import { FiCheckCircle, FiCreditCard, FiHeadphones } from 'react-icons/fi';

export function WhyChooseSection() {
  const features = [
    {
      title: 'Verified Professionals',
      description:
        'Every service provider is checked and verified so you can book with confidence.',
      icon: <FiCheckCircle className="text-xl" />,
    },
    {
      title: 'Secure Payments',
      description:
        'Pay safely through the platform with clear pricing and transparent confirmations.',
      icon: <FiCreditCard className="text-xl" />,
    },
    {
      title: '24/7 Support',
      description:
        'Need help at any time? Our support team is ready to assist you, every day.',
      icon: <FiHeadphones className="text-xl" />,
    },
  ];

  return (
    <section id="why" className="bg-white py-12 sm:py-16">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="flex items-start gap-4">
          <div className="h-10 w-1 rounded bg-cyan-500 mt-1 hidden sm:block" />
          <div>
            <h2 className="text-2xl font-extrabold text-slate-900 sm:text-3xl">
              Why choose Service Sathi?
            </h2>
          </div>
        </div>

        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {features.map((f) => (
            <div
              key={f.title}
              className="px-1 py-2 flex items-start gap-4"
            >
              <div className="mt-0.5 flex h-12 w-12 flex-none items-center justify-center rounded-2xl bg-cyan-500/10 text-cyan-600 border border-cyan-200">
                {f.icon}
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">{f.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">
                  {f.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

