import { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { FileText, Upload, Download, Eye, LayoutGrid, List } from 'lucide-react';
import { Card, Badge, Button } from '../../components/common';
import { localizeDocument, t } from '../../utils/i18n';
import type { Document } from '../../types';

const statusVariant: Record<string, 'success' | 'primary' | 'warning' | 'default'> = {
  verified: 'success',
  available: 'primary',
  pending: 'warning',
  expired: 'default',
};

function DocumentIcon() {
  return <FileText size={22} strokeWidth={1.6} aria-hidden="true" />;
}

export function DocumentsPage() {
  const { documents, language, uploadDocument, deleteDocument, showToast } = useApp();
  const [showUpload, setShowUpload] = useState(false);
  const [newDocName, setNewDocName] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const verifiedCount = documents.filter((d) => d.status === 'verified').length;

  const handleUpload = () => {
    if (!newDocName.trim()) return;
    const doc: Document = {
      id: `doc-${Date.now()}`,
      name: newDocName.trim(),
      type: 'other',
      status: 'available',
      updatedAt: new Date().toISOString().split('T')[0],
      fileName: `${newDocName.toLowerCase().replace(/\s+/g, '_')}.pdf`,
    };
    uploadDocument(doc);
    setNewDocName('');
    setShowUpload(false);
    showToast(t('documents.uploaded', language));
  };

  const handleRemove = (id: string, name: string) => {
    if (window.confirm(t('documents.removeConfirm', language, { name }))) {
      deleteDocument(id);
      showToast(t('documents.removed', language));
    }
  };

  return (
    <div className="container">
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 'var(--space-4)' }}>
        <div>
          <h1 className="page-title">{t('documents.title', language)}</h1>
          <div className="documents-header-stats">
            <span className="documents-count">{documents.length}</span>
            <span className="page-subtitle" style={{ margin: 0 }}>
              {t('documents.stats', language, { count: documents.length, verified: verifiedCount })}
            </span>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
          <Button variant="ghost" size="sm" onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}>
            {viewMode === 'grid' ? <><List size={14} /> {t('documents.list', language)}</> : <><LayoutGrid size={14} /> {t('documents.grid', language)}</>}
          </Button>
          <Button variant="primary" onClick={() => setShowUpload(true)}>
            <Upload size={14} /> {t('documents.upload', language)}
          </Button>
        </div>
      </div>

      <div className={viewMode === 'grid' ? 'documents-grid' : ''} style={viewMode === 'list' ? { display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' } : undefined}>
        {documents.map((document) => {
          const doc = localizeDocument(document, language);
          return (
          <Card key={doc.id}>
            {viewMode === 'grid' ? (
              <div className="document-card-grid">
                <div className="document-card-icon"><DocumentIcon /></div>
                <div className="document-name">{doc.name}</div>
                {doc.status === 'verified' && (
                  <span className="document-verified-badge">✓ {t('documents.verified', language)}</span>
                )}
                <div className="document-meta">{t('common.updated', language)} {doc.updatedAt}</div>
                <Badge variant={statusVariant[doc.status] || 'default'}>
                  {t(`documents.${doc.status}`, language)}
                </Badge>
                <div className="document-actions">
                  <Button variant="ghost" size="sm" onClick={() => showToast(t('documents.viewing', language, { name: doc.name }))}><Eye size={14} /> {t('common.view', language)}</Button>
                  <Button variant="ghost" size="sm" onClick={() => showToast(t('documents.downloadStarted', language, { name: doc.name }))}><Download size={14} /> {t('common.download', language)}</Button>
                  <Button variant="ghost" size="sm" onClick={() => handleRemove(doc.id, doc.name)}>{t('common.remove', language)}</Button>
                </div>
              </div>
            ) : (
              <div className="document-card">
                <div className="document-info">
                  <div className="document-name">{doc.name}</div>
                  <div className="document-meta">
                    {t('common.updated', language)}: {doc.updatedAt}
                    {doc.fileName && ` · ${doc.fileName}`}
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                  <Badge variant={statusVariant[doc.status] || 'default'}>
                    {doc.status === 'verified' ? `✓ ${t('documents.verified', language)}` : t(`documents.${doc.status}`, language)}
                  </Badge>
                  <div className="document-actions">
                    <Button variant="ghost" size="sm" onClick={() => showToast(t('documents.viewing', language, { name: doc.name }))}><Eye size={14} /> {t('common.view', language)}</Button>
                    <Button variant="ghost" size="sm" onClick={() => showToast(t('documents.downloadStarted', language, { name: doc.name }))}><Download size={14} /> {t('common.download', language)}</Button>
                    <Button variant="ghost" size="sm" onClick={() => handleRemove(doc.id, doc.name)}>{t('common.remove', language)}</Button>
                  </div>
                </div>
              </div>
            )}
          </Card>
          );
        })}
      </div>

      {showUpload && (
        <div className="modal-overlay" onClick={() => setShowUpload(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()} role="dialog" aria-labelledby="upload-title">
            <h2 id="upload-title" className="modal-title">{t('documents.upload', language)}</h2>
            <div className="form-group">
              <label className="form-label" htmlFor="docName">{t('documents.name', language)}</label>
              <input
                id="docName"
                className="form-input"
                value={newDocName}
                onChange={(e) => setNewDocName(e.target.value)}
                placeholder={t('documents.placeholder', language)}
                autoFocus
              />
              <p className="form-hint">{t('documents.prototypeNote', language)}</p>
            </div>
            <div className="modal-actions">
              <Button variant="ghost" onClick={() => setShowUpload(false)}>{t('common.cancel', language)}</Button>
              <Button variant="primary" onClick={handleUpload} disabled={!newDocName.trim()}>{t('documents.upload', language)}</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
