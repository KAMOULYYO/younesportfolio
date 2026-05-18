import { useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { Send, Mail, MapPin, CheckCircle } from 'lucide-react';
import { GithubIcon, LinkedinIcon } from '@/components/ui/social-icons';
import { usePortfolio } from '@/context/PortfolioContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

const CONTACT_EMAIL = 'contact.localboostai@gmail.com';

export default function Contact() {
  const { data } = usePortfolio();
  const { profile } = data;
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', message: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) return;

    const subject = encodeURIComponent('Message depuis le portfolio de Younes Kamouly');
    const body = encodeURIComponent(
      `Nom : ${form.name}\nEmail : ${form.email}\n\nMessage :\n${form.message}`
    );
    window.open(`mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`, '_self');

    setSent(true);
    setForm({ name: '', email: '', message: '' });
    setTimeout(() => setSent(false), 6000);
  };

  const contactLinks = [
    {
      icon: Mail,
      label: 'Email',
      value: CONTACT_EMAIL,
      href: `mailto:${CONTACT_EMAIL}`,
    },
    {
      icon: GithubIcon,
      label: 'GitHub',
      value: '@KAMOULYYO',
      href: profile.github,
    },
    {
      icon: LinkedinIcon,
      label: 'LinkedIn',
      value: 'Younes Kamouly',
      href: profile.linkedin,
    },
    {
      icon: MapPin,
      label: 'Localisation',
      value: profile.location,
      href: '#',
    },
  ];

  return (
    <section id="contact" className="py-24 px-6 relative overflow-hidden">
      <div className="absolute inset-0 grid-bg opacity-20" />
      <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-[#C3E41D]/4 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <span className="text-[#C3E41D] font-fira text-sm tracking-widest">&gt; contact.me</span>
          <h2 className="text-4xl md:text-5xl font-bold mt-2 text-white">
            Travaillons ensemble<span className="text-[#C3E41D]">.</span>
          </h2>
          <p className="text-white/40 mt-4 max-w-xl">
            Un projet en tête ? Une opportunité à partager ? N&apos;hésitez pas à me contacter.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-12">
          {/* Links */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.2 }}
          >
            <h3 className="text-white font-bold text-xl mb-8">Retrouvez-moi</h3>
            <div className="space-y-4">
              {contactLinks.map((link, i) => (
                <motion.a
                  key={link.label}
                  href={link.href}
                  target={link.href !== '#' && !link.href.startsWith('mailto') ? '_blank' : undefined}
                  rel="noopener noreferrer"
                  initial={{ opacity: 0, x: -20 }}
                  animate={inView ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: 0.3 + i * 0.08 }}
                  whileHover={{ x: 6 }}
                  className="flex items-center gap-4 p-4 rounded-xl border border-white/5 bg-white/3 hover:border-[#C3E41D]/20 hover:bg-white/5 transition-all duration-300 group"
                >
                  <div className="p-2.5 rounded-lg bg-[#C3E41D]/10 group-hover:bg-[#C3E41D]/20 transition-colors flex-shrink-0">
                    <link.icon className="w-5 h-5 text-[#C3E41D]" />
                  </div>
                  <div>
                    <p className="text-white/40 text-xs font-fira">{link.label}</p>
                    <p className="text-white text-sm font-medium break-all">{link.value}</p>
                  </div>
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.3 }}
          >
            {sent ? (
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="flex flex-col items-center justify-center h-full text-center py-12"
              >
                <CheckCircle className="w-16 h-16 text-[#C3E41D] mb-4" />
                <h3 className="text-white font-bold text-xl mb-2">Message prêt !</h3>
                <p className="text-white/40">
                  Votre client mail s&apos;est ouvert avec le message pré-rempli.
                </p>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="text-white/50 text-xs font-fira mb-1.5 block">Nom</label>
                  <Input
                    placeholder="Votre nom"
                    value={form.name}
                    onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                    required
                  />
                </div>
                <div>
                  <label className="text-white/50 text-xs font-fira mb-1.5 block">Email</label>
                  <Input
                    type="email"
                    placeholder="votre@email.com"
                    value={form.email}
                    onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                    required
                  />
                </div>
                <div>
                  <label className="text-white/50 text-xs font-fira mb-1.5 block">Message</label>
                  <Textarea
                    placeholder="Décrivez votre projet ou votre demande..."
                    rows={5}
                    value={form.message}
                    onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                    required
                    className="min-h-[140px]"
                  />
                </div>
                <Button type="submit" size="lg" className="w-full">
                  <Send className="w-4 h-4 mr-2" />
                  Envoyer le message
                </Button>
                <p className="text-white/20 text-xs text-center font-fira">
                  Envoi via votre client mail vers {CONTACT_EMAIL}
                </p>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
