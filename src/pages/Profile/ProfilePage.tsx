import { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Card, Button } from '../../components/common';
import { t, languageLabels } from '../../utils/i18n';
import type { Language, CitizenProfile } from '../../types';

export function ProfilePage() {
  const { profile, language, updateProfileData, showToast } = useApp();
  const [form, setForm] = useState<CitizenProfile>({ ...profile });
  const [editing, setEditing] = useState(false);

  const updateField = <K extends keyof CitizenProfile>(field: K, value: CitizenProfile[K]) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    updateProfileData(form);
    setEditing(false);
    showToast(t('profile.saved', language));
  };

  const handleLanguageChange = (lang: Language) => {
    setForm((prev) => ({ ...prev, language: lang }));
    updateProfileData({ language: lang });
  };

  return (
    <div className="container">
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1 className="page-title">{t('profile.title', language)}</h1>
          <p className="page-subtitle">{t('profile.subtitle', language)}</p>
        </div>
        {!editing ? (
          <Button variant="secondary" onClick={() => setEditing(true)}>
            {t('common.edit', language)}
          </Button>
        ) : (
          <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
            <Button variant="ghost" onClick={() => { setForm({ ...profile }); setEditing(false); }}>
              {t('common.cancel', language)}
            </Button>
            <Button variant="primary" onClick={handleSave}>
              {t('profile.save', language)}
            </Button>
          </div>
        )}
      </div>

      <div className="profile-grid">
        <Card className="profile-section-card">
          <h2 className="profile-section-title">{t('profile.personal', language)}</h2>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">{t('profile.firstName', language)}</label>
              <input
                className="form-input"
                value={form.firstName}
                onChange={(e) => updateField('firstName', e.target.value)}
                disabled={!editing}
              />
            </div>
            <div className="form-group">
              <label className="form-label">{t('profile.lastName', language)}</label>
              <input
                className="form-input"
                value={form.lastName}
                onChange={(e) => updateField('lastName', e.target.value)}
                disabled={!editing}
              />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">{t('profile.dob', language)}</label>
              <input
                type="date"
                className="form-input"
                value={form.dateOfBirth}
                onChange={(e) => updateField('dateOfBirth', e.target.value)}
                disabled={!editing}
              />
            </div>
            <div className="form-group">
              <label className="form-label">{t('profile.gender', language)}</label>
              <select
                className="form-select"
                value={form.gender}
                onChange={(e) => updateField('gender', e.target.value)}
                disabled={!editing}
              >
                <option value="Male">{t('profile.male', language)}</option>
                <option value="Female">{t('profile.female', language)}</option>
                <option value="Other">{t('profile.other', language)}</option>
              </select>
            </div>
          </div>
        </Card>

        <Card className="profile-section-card">
          <h2 className="profile-section-title">{t('profile.contact', language)}</h2>
          <div className="form-group">
            <label className="form-label">{t('profile.email', language)}</label>
            <input
              type="email"
              className="form-input"
              value={form.email}
              onChange={(e) => updateField('email', e.target.value)}
              disabled={!editing}
            />
          </div>
          <div className="form-group">
            <label className="form-label">{t('profile.mobile', language)}</label>
            <input
              className="form-input"
              value={form.mobile}
              onChange={(e) => updateField('mobile', e.target.value)}
              disabled={!editing}
            />
          </div>
          <div className="form-group">
            <label className="form-label">{t('profile.aadhaar', language)}</label>
            <input
              className="form-input"
              value={form.aadhaar}
              onChange={(e) => updateField('aadhaar', e.target.value)}
              disabled={!editing}
            />
          </div>
        </Card>

        <Card className="profile-section-card">
          <h2 className="profile-section-title">{t('profile.education', language)}</h2>
          <div className="form-group">
            <label className="form-label">{t('profile.educationLevel', language)}</label>
            <input
              className="form-input"
              value={form.education}
              onChange={(e) => updateField('education', e.target.value)}
              disabled={!editing}
            />
          </div>
          <div className="form-group">
            <label className="form-label">{t('profile.institution', language)}</label>
            <input
              className="form-input"
              value={form.institution || ''}
              onChange={(e) => updateField('institution', e.target.value)}
              disabled={!editing}
            />
          </div>
        </Card>

        <Card className="profile-section-card">
          <h2 className="profile-section-title">{t('profile.location', language)}</h2>
          <div className="form-group">
            <label className="form-label">{t('profile.address', language)}</label>
            <input
              className="form-input"
              value={form.address}
              onChange={(e) => updateField('address', e.target.value)}
              disabled={!editing}
            />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">{t('profile.city', language)}</label>
              <input
                className="form-input"
                value={form.city}
                onChange={(e) => updateField('city', e.target.value)}
                disabled={!editing}
              />
            </div>
            <div className="form-group">
              <label className="form-label">{t('profile.pincode', language)}</label>
              <input
                className="form-input"
                value={form.pincode}
                onChange={(e) => updateField('pincode', e.target.value)}
                disabled={!editing}
              />
            </div>
          </div>
        </Card>

        <Card className="profile-section-card" style={{ gridColumn: '1 / -1' }}>
          <h2 className="profile-section-title">{t('profile.preferences', language)}</h2>
          <div className="form-group">
            <label className="form-label">{t('profile.language', language)}</label>
            <div style={{ display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap' }}>
              {(Object.keys(languageLabels) as Language[]).map((lang) => (
                <button
                  key={lang}
                  type="button"
                  className={`option-btn ${form.language === lang ? 'selected' : ''}`}
                  style={{ flex: '0 0 auto', minHeight: 40, padding: 'var(--space-2) var(--space-4)' }}
                  onClick={() => handleLanguageChange(lang)}
                >
                  {languageLabels[lang]}
                </button>
              ))}
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">{t('profile.notifications', language)}</label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', fontSize: 'var(--font-size-sm)' }}>
                <input type="checkbox" defaultChecked />
                {t('profile.appUpdates', language)}
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', fontSize: 'var(--font-size-sm)' }}>
                <input type="checkbox" defaultChecked />
                {t('profile.schemeAlerts', language)}
              </label>
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">{t('profile.accessibility', language)}</label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', fontSize: 'var(--font-size-sm)' }}>
                <input
                  type="checkbox"
                  checked={form.accessibility.highContrast}
                  onChange={(e) =>
                    updateField('accessibility', { ...form.accessibility, highContrast: e.target.checked })
                  }
                />
                {t('profile.highContrast', language)}
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', fontSize: 'var(--font-size-sm)' }}>
                <input
                  type="checkbox"
                  checked={form.accessibility.largeText}
                  onChange={(e) =>
                    updateField('accessibility', { ...form.accessibility, largeText: e.target.checked })
                  }
                />
                {t('profile.largeText', language)}
              </label>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
