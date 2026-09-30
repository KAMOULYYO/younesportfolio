import { useRef, useState } from 'react';
import { m, useInView } from 'framer-motion';
import { Send, Mail, MapPin, CheckCircle, CalendarClock, Loader2, AlertCircle, ArrowUpRight } from 'lucide-react';
import { GithubIcon, LinkedinIcon } from '@/components/ui/social-icons';
import { usePortfolio } from '@/context/PortfolioContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useLang } from '@/lib/i18n';
import { track } from '@/lib/analytics';

type Status = 'idle' | 'sending' | 'sent' | 'error';

export default function Contact() {
  const { data } = usePortfolio();
  const { profile } = data;
  const { t, lang } = useLang();
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });
  const [status, setStatus] = useState<Status>('idle');
  const [form, setForm] = useState({ name: '', email: '', message: '', website: '' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Champ piège invisible : rempli uniquement par les robots
    if (form.website) { setStatus('sent'); return; }
    setStatus('sending');
    try {
      const { supabase, isConfigured } = await import('@/lib/supabase');
      if (!isConfigured) throw new Error('not configured');
      const { error } = await supabase.from('messages').insert({
        name: form.name.trim().slice(0, 100),
        email: form.email.trim().slice(0, 200),
        message: form.message.trim().slice(0, 5000),
        lang,
      });
      if (error) throw error;
      track('contact_sent');
      setStatus('sent');
      setForm({ name: '', email: '', message: '', website: '' });
    } catch (err) {
      console.error('[Contact] envoi impossible :', err);
      setStatus('error');
    }
  };

  const contactLinks = [
    { icon: Mail, label: t('contact.email'), value: profile.email, href: `mailto:${profile.email}` },
    { icon: GithubIcon, label: 'GitHub', value: '@' + (profile.github.split('/').filter(Boolean).pop() ?? ''), href: profile.github },
    { icon: LinkedinIcon, label: 'LinkedIn', value: profile.name, href: profile.linkedin },
    { icon: MapPin, label: t('contact.location'), value: profile.location, href: '' },
  ];

  return (
    <section id="contact" className="py-24 px-6 relative overflow-hidden">
      <div className="absolute inset-0 grid-bg opacity-20" />
      <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-accent/4 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto" ref={ref}>
        <m.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <span className="text-accent font-fira text-sm tracking-widest">&gt; contact.me</span>
          <h2 className="text-4xl md:text-5xl font-bold mt-2 text-white">
            {t('contact.title')}<span className="text-accent">.</span>
          </h2>
          <p className="text-white/40 mt-4 max-w-xl">{t('contact.sub')}</p>
        </m.div>

        <div className="grid md:grid-cols-2 gap-12">
          {/* Liens + rendez-vous */}
          <m.div
            initial={{ opacity: 0, x: -30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.2 }}
          >
            {profile.bookingUrl && (
              <a
                href={profile.bookingUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => track('booking_click', 'contact')}
                className="group flex items-center gap-4 p-5 mb-8 rounded-2xl border border-accent/40 bg-accent/10 hover:bg-accent/15 transition-all"
              >
                <span className="p-3 rounded-xl bg-accent text-black flex-shrink-0">
                  <CalendarClock className="w-6 h-6" aria-hidden="true" />
                </span>
                <span className="flex-1">
                  <span className="block text-white font-bold">{t('contact.book')}</span>
                  <span className="block text-white/50 text-sm">{t('contact.bookSub')}</span>
                </span>
                <ArrowUpRight className="w-5 h-5 text-accent group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </a>
            )}

            <h3 className="text-white font-bold text-xl mb-8">{t('contact.find')}</h3>
            <div className="space-y-4">
              {contactLinks.map((link, i) => {
                const inner = (
                  <>
                    <div className="p-2.5 rounded-lg bg-accent/10 group-hover:bg-accent/20 transition-colors flex-shrink-0">
                      <link.icon className="w-5 h-5 text-accent" />
                    </div>
                    <div>
                      <p className="text-white/40 text-xs font-fira">{link.label}</p>
                      <p className="text-white text-sm font-medium break-all">{link.value}</p>
                    </div>
                  </>
                );
                const cls = 'spotlight flex items-center gap-4 p-4 rounded-xl border border-white/5 bg-white/3 hover:border-accent/20 hover:bg-white/5 transition-all duration-300 group';
                return (
                  <m.div
                    key={link.label}
                    initial={{ opacity: 0, x: -20 }}
                    animate={inView ? { opacity: 1, x: 0 } : {}}
                    transition={{ delay: 0.3 + i * 0.08 }}
                  >
                    {link.href ? (
                      <a
                        href={link.href}
                        target={link.href.startsWith('mailto') ? undefined : '_blank'}
                        rel="noopener noreferrer"
                        className={cls}
                      >
                        {inner}
                      </a>
                    ) : (
                      <div className={cls}>{inner}</div>
                    )}
                  </m.div>
                );
              })}
            </div>
          </m.div>

          {/* Formulaire */}
          <m.div
            initial={{ opacity: 0, x: 30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.3 }}
          >
            {status === 'sent' ? (
              <m.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="flex flex-col items-center justify-center h-full text-center py-12"
                role="status"
              >
                <CheckCircle className="w-16 h-16 text-accent mb-4" />
                <h3 className="text-white font-bold text-xl mb-2">{t('contact.sent')}</h3>
                <p className="text-white/50 mb-6">{t('contact.sentSub')}</p>
                <Button variant="ghost" onClick={() => setStatus('idle')}>{t('contact.another')}</Button>
              </m.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="c-name" className="text-white/50 text-xs font-fira mb-1.5 block">{t('contact.name')}</label>
                  <Input
                    id="c-name"
                    placeholder={t('contact.namePh')}
                    value={form.name}
                    onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                    maxLength={100}
                    autoComplete="name"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="c-email" className="text-white/50 text-xs font-fira mb-1.5 block">{t('contact.email')}</label>
                  <Input
                    id="c-email"
                    type="email"
                    placeholder="nom@entreprise.com"
                    value={form.email}
                    onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                    maxLength={200}
                    autoComplete="email"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="c-msg" className="text-white/50 text-xs font-fira mb-1.5 block">{t('contact.message')}</label>
                  <Textarea
                    id="c-msg"
                    placeholder={t('contact.messagePh')}
                    rows={5}
                    value={form.message}
                    onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                    minLength={5}
                    maxLength={5000}
                    required
                    className="min-h-[140px]"
                  />
                </div>
                {/* Piège anti-robots : invisible pour les humains */}
                <input
                  type="text"
                  name="website"
                  tabIndex={-1}
                  autoComplete="off"
                  aria-hidden="true"
                  value={form.website}
                  onChange={e => setForm(f => ({ ...f, website: e.target.value }))}
                  className="absolute -left-[9999px] w-px h-px opacity-0"
                />

                {status === 'error' && (
                  <p role="alert" className="flex items-start gap-2 text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
                    <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                    <span>
                      {t('contact.error')}{' '}
                      <a href={`mailto:${profile.email}`} className="underline">{profile.email}</a>
                    </span>
                  </p>
                )}

                <Button type="submit" size="lg" className="w-full" disabled={status === 'sending'}>
                  {status === 'sending'
                    ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> {t('contact.sending')}</>
                    : <><Send className="w-4 h-4 mr-2" /> {t('contact.send')}</>}
                </Button>
              </form>
            )}
          </m.div>
        </div>
      </div>
    </section>
  );
}
