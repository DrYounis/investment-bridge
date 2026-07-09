'use client';

import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';

interface StepTwoProps {
  onHighlightsExtracted: (highlights: any) => void;
  onNext: () => void;
}

export default function StepTwo_Upload({ onHighlightsExtracted, onNext }: StepTwoProps) {
  const [file, setFile] = useState<File | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState('');

  const onDrop = useCallback((accepted: File[]) => {
    if (accepted.length > 0) {
      setFile(accepted[0]);
      setError('');
      setResult(null);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'application/pdf': ['.pdf'], 'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'], 'application/msword': ['.doc'], 'text/plain': ['.txt'] },
    maxSize: 10 * 1024 * 1024,
    maxFiles: 1,
  });

  const analyzeDocument = async () => {
    if (!file) return;
    setAnalyzing(true);
    setError('');
    try {
      const fd = new FormData();
      fd.append('file', file);
      const res = await fetch('/api/analyze-document', { method: 'POST', body: fd });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setResult(data.highlights);
      onHighlightsExtracted(data.highlights);
    } catch (e: any) {
      setError(e.message || 'حدث خطأ في التحليل');
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="space-y-5" dir="rtl">
      <div>
        <h2 className="text-2xl font-bold text-white mb-2">رفع المستندات</h2>
        <p className="text-[#8a9bb8] text-sm">ارفع ملف PDF أو Word وسيقوم الذكاء الاصطناعي باستخراج النقاط الرئيسية</p>
      </div>

      {/* Drop zone */}
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer transition-all ${
          isDragActive ? 'border-[#c9a84c] bg-[#c9a84c]/5' : 'border-[#1e2d4a] hover:border-[#c9a84c]/40'
        }`}
      >
        <input {...getInputProps()} />
        <div className="text-4xl mb-3">📎</div>
        {file ? (
          <div>
            <p className="text-white font-bold">{file.name}</p>
            <p className="text-[#4a5a78] text-sm">{(file.size / 1024).toFixed(1)} KB</p>
          </div>
        ) : (
          <div>
            <p className="text-[#8a9bb8]">اسحب وأفلت الملف هنا، أو اضغط للتصفح</p>
            <p className="text-[#4a5a78] text-xs mt-2">PDF, Word, TXT — حتى 10MB</p>
          </div>
        )}
      </div>

      {file && (
        <div className="flex gap-3">
          <button
            onClick={analyzeDocument}
            disabled={analyzing}
            className="px-6 py-3 bg-gradient-to-r from-[#c9a84c] to-[#a07830] text-[#0a0f1e] font-bold rounded-xl hover:from-[#e2c478] hover:to-[#c9a84c] transition-all disabled:opacity-50"
          >
            {analyzing ? '⏳ جاري التحليل...' : '🔍 تحليل المستند'}
          </button>
          <button
            onClick={() => { setFile(null); setResult(null); }}
            className="px-6 py-3 border border-[#1e2d4a] text-[#8a9bb8] rounded-xl hover:border-[#c9a84c]/40"
          >
            إزالة
          </button>
        </div>
      )}

      {error && <p className="text-red-400 text-sm">{error}</p>}

      {result && (
        <div className="bg-[#111827] border border-[#c9a84c]/20 rounded-xl p-4 space-y-2">
          <h4 className="text-[#c9a84c] font-bold">✅ تم استخراج المعلومات</h4>
          {result.projectName && <p className="text-sm text-white"><strong>المشروع:</strong> {result.projectName}</p>}
          {result.highlights?.length > 0 && (
            <ul className="text-sm text-[#8a9bb8] space-y-1 list-disc list-inside">
              {result.highlights.slice(0, 5).map((h: string, i: number) => <li key={i}>{h}</li>)}
            </ul>
          )}
        </div>
      )}

      <div className="flex justify-between pt-4">
        <button onClick={() => onNext()} className="px-8 py-3 bg-gradient-to-r from-[#c9a84c] to-[#a07830] text-[#0a0f1e] font-bold rounded-xl">
          التالي ←
        </button>
      </div>
    </div>
  );
}
