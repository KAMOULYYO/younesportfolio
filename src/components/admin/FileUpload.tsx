import { useRef, useState } from 'react';
import { Upload, Loader2, X, CheckCircle, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { uploadFile, validateFile, UPLOAD_LIMITS, type UploadKind } from '@/lib/storage';

interface Props {
  kind: UploadKind;
  label: string;
  onUploaded: (url: string) => void;
}

function uploadError(e: unknown): string {
  const code = (e as { code?: string })?.code;
  if (code === 'unauthorized') return "Accès refusé : vérifie que tu es connecté avec le compte admin (email dans supabase/setup.sql).";
  if (code === 'bucket-missing') return "Espace de fichiers introuvable : exécute supabase/setup.sql dans Supabase.";
  if (code === 'too-large') return 'Fichier trop lourd pour le plan gratuit (50 Mo max).';
  return (e as Error)?.message ?? "Échec de l'envoi.";
}

// Bouton « Envoyer un fichier » vers Supabase Storage, avec barre de progression
export default function FileUpload({ kind, label, onUploaded }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const cancelRef = useRef<(() => void) | null>(null);
  const [progress, setProgress] = useState<number | null>(null);
  const [error, setError] = useState('');
  const [done, setDone] = useState(false);

  const handleFile = async (file: File | undefined) => {
    if (!file) return;
    setError('');
    setDone(false);
    const invalid = validateFile(file, kind);
    if (invalid) { setError(invalid); return; }

    setProgress(0);
    const { cancel, done: finished } = uploadFile(file, kind, setProgress);
    cancelRef.current = cancel;
    try {
      const url = await finished;
      onUploaded(url);
      setDone(true);
    } catch (e) {
      setError(uploadError(e));
    } finally {
      setProgress(null);
      cancelRef.current = null;
      if (inputRef.current) inputRef.current.value = '';
    }
  };

  const uploading = progress !== null;

  return (
    <div className="space-y-2">
      <input
        ref={inputRef}
        type="file"
        accept={UPLOAD_LIMITS[kind].accept}
        className="hidden"
        onChange={e => handleFile(e.target.files?.[0])}
      />
      <div className="flex items-center gap-2 flex-wrap">
        <Button type="button" variant="outline" size="sm" disabled={uploading} onClick={() => inputRef.current?.click()}>
          {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
          {uploading ? `Envoi… ${progress}%` : label}
        </Button>
        {uploading && (
          <Button type="button" variant="ghost" size="sm" onClick={() => cancelRef.current?.()}>
            <X className="w-4 h-4" /> Annuler
          </Button>
        )}
        {done && !uploading && (
          <span className="flex items-center gap-1 text-accent text-xs"><CheckCircle className="w-3.5 h-3.5" /> Fichier envoyé</span>
        )}
        <span className="text-white/30 text-xs">max {UPLOAD_LIMITS[kind].maxMb} Mo</span>
      </div>
      {uploading && (
        <div className="h-1.5 w-full max-w-xs rounded-full bg-white/10 overflow-hidden">
          <div className="h-full bg-accent transition-[width] duration-200" style={{ width: `${progress}%` }} />
        </div>
      )}
      {error && (
        <p role="alert" className="flex items-start gap-1.5 text-red-400 text-xs">
          <AlertCircle className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" /> {error}
        </p>
      )}
    </div>
  );
}
