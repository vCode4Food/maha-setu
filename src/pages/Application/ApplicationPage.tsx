import { useState } from 'react';
import { useParams, useNavigate, Navigate } from 'react-router-dom';
import { getServiceById, createApplicationFromSubmission, clearDraftApplication } from '../../services/dataService';
import { Card, Button, ProgressSteps, InfoBox } from '../../components/common';
import { useApp } from '../../context/AppContext';
import { localizeDocument, localizeService, t } from '../../utils/i18n';
import type { ApplicationFormData } from '../../types';

const STEP_KEYS = ['application.personal', 'application.eligibilityDetails', 'application.docsStep', 'application.review', 'application.submitStep'];

export function ApplicationPage() {
  const { serviceId } = useParams<{ serviceId: string }>();
  const navigate = useNavigate();
  const { profile, documents, language, submitApplication, showToast } = useApp();
  const rawService = serviceId ? getServiceById(serviceId) : undefined;
  const service = rawService ? localizeService(rawService, language) : undefined;

  const [currentStep, setCurrentStep] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState<ApplicationFormData>({
    personalDetails: {
      firstName: profile.firstName,
      lastName: profile.lastName,
      dateOfBirth: profile.dateOfBirth,
      gender: profile.gender,
      email: profile.email,
      mobile: profile.mobile,
      aadhaar: profile.aadhaar,
    },
    eligibilityDetails: {
      educationLevel: profile.education,
      institution: profile.institution || '',
      annualIncome: 'Below ₹2.5 lakh',
      category: 'General',
    },
    selectedDocuments: [],
    additionalNotes: '',
  });

  if (!service) {
    return <Navigate to="/search" replace />;
  }

  const updatePersonal = (field: keyof ApplicationFormData['personalDetails'], value: string) => {
    setFormData((prev) => ({
      ...prev,
      personalDetails: { ...prev.personalDetails, [field]: value },
    }));
  };

  const updateEligibility = (field: keyof ApplicationFormData['eligibilityDetails'], value: string) => {
    setFormData((prev) => ({
      ...prev,
      eligibilityDetails: { ...prev.eligibilityDetails, [field]: value },
    }));
  };

  const toggleDocument = (docId: string) => {
    setFormData((prev) => ({
      ...prev,
      selectedDocuments: prev.selectedDocuments.includes(docId)
        ? prev.selectedDocuments.filter((id) => id !== docId)
        : [...prev.selectedDocuments, docId],
    }));
  };

  const handleSubmit = () => {
    const application = createApplicationFromSubmission(service.id, rawService?.title ?? service.title);
    submitApplication(application);
    clearDraftApplication(service.id);
    setSubmitted(true);
    showToast(t('application.success', language));
    setTimeout(() => navigate(`/applications/${application.id}`), 1500);
  };

  const canProceed = () => {
    if (currentStep === 0) {
      return formData.personalDetails.firstName && formData.personalDetails.mobile;
    }
    if (currentStep === 2) {
      return formData.selectedDocuments.length > 0;
    }
    return true;
  };

  if (submitted) {
    return (
      <div className="container">
        <div className="application-layout" style={{ textAlign: 'center', padding: 'var(--space-12) 0' }}>
          <div style={{ fontSize: '3rem', marginBottom: 'var(--space-4)' }}>✓</div>
          <h1 className="page-title">{t('application.success', language)}</h1>
          <p className="page-subtitle">{t('application.redirecting', language)}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="application-layout">
        <div className="page-header">
          <h1 className="page-title">{t('application.title', language)}</h1>
          <p className="page-subtitle">{service.title}</p>
        </div>

        <ProgressSteps steps={STEP_KEYS.map((key) => t(key, language))} currentStep={currentStep} />

        {currentStep === 0 && (
          <InfoBox variant="info">
            {t('application.info', language)}
          </InfoBox>
        )}

        <Card style={{ marginTop: 'var(--space-6)' }}>
          <div className="application-step-content">
            {currentStep === 0 && (
              <>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label" htmlFor="firstName">{t('profile.firstName', language)}</label>
                    <input
                      id="firstName"
                      className="form-input form-input-prefilled"
                      value={formData.personalDetails.firstName}
                      onChange={(e) => updatePersonal('firstName', e.target.value)}
                    />
                    <span className="prefill-indicator">↗ {t('application.prefilled', language)}</span>
                  </div>
                  <div className="form-group">
                    <label className="form-label" htmlFor="lastName">{t('profile.lastName', language)}</label>
                    <input
                      id="lastName"
                      className="form-input form-input-prefilled"
                      value={formData.personalDetails.lastName}
                      onChange={(e) => updatePersonal('lastName', e.target.value)}
                    />
                    <span className="prefill-indicator">↗ {t('application.prefilled', language)}</span>
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label" htmlFor="dob">{t('profile.dob', language)}</label>
                    <input
                      id="dob"
                      type="date"
                      className="form-input form-input-prefilled"
                      value={formData.personalDetails.dateOfBirth}
                      onChange={(e) => updatePersonal('dateOfBirth', e.target.value)}
                    />
                    <span className="prefill-indicator">↗ {t('application.prefilled', language)}</span>
                  </div>
                  <div className="form-group">
                    <label className="form-label" htmlFor="gender">{t('profile.gender', language)}</label>
                    <select
                      id="gender"
                      className="form-select"
                      value={formData.personalDetails.gender}
                      onChange={(e) => updatePersonal('gender', e.target.value)}
                    >
                      <option value="Male">{t('profile.male', language)}</option>
                      <option value="Female">{t('profile.female', language)}</option>
                      <option value="Other">{t('profile.other', language)}</option>
                    </select>
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="email">{t('profile.email', language)}</label>
                  <input
                    id="email"
                    type="email"
                    className="form-input form-input-prefilled"
                    value={formData.personalDetails.email}
                    onChange={(e) => updatePersonal('email', e.target.value)}
                  />
                  <span className="prefill-indicator">↗ {t('application.prefilled', language)}</span>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label" htmlFor="mobile">{t('profile.mobile', language)}</label>
                    <input
                      id="mobile"
                      className="form-input form-input-prefilled"
                      value={formData.personalDetails.mobile}
                      onChange={(e) => updatePersonal('mobile', e.target.value)}
                    />
                    <span className="prefill-indicator">↗ {t('application.prefilled', language)}</span>
                  </div>
                  <div className="form-group">
                    <label className="form-label" htmlFor="aadhaar">{t('profile.aadhaar', language)}</label>
                    <input
                      id="aadhaar"
                      className="form-input form-input-prefilled"
                      value={formData.personalDetails.aadhaar}
                      onChange={(e) => updatePersonal('aadhaar', e.target.value)}
                    />
                    <span className="prefill-indicator">↗ {t('application.prefilled', language)}</span>
                  </div>
                </div>
              </>
            )}

            {currentStep === 1 && (
              <>
                <div className="form-group">
                  <label className="form-label" htmlFor="educationLevel">{t('profile.educationLevel', language)}</label>
                  <select
                    id="educationLevel"
                    className="form-select form-input-prefilled"
                    value={formData.eligibilityDetails.educationLevel}
                    onChange={(e) => updateEligibility('educationLevel', e.target.value)}
                  >
                    <option value="10th Standard">{t('form.10th', language)}</option>
                    <option value="12th Standard (Completed)">{t('form.12th', language)}</option>
                    <option value="Graduate">{t('form.graduate', language)}</option>
                    <option value="Post Graduate">{t('form.postGraduate', language)}</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="institution">{t('application.institutionEmployer', language)}</label>
                  <input
                    id="institution"
                    className="form-input"
                    value={formData.eligibilityDetails.institution}
                    onChange={(e) => updateEligibility('institution', e.target.value)}
                    placeholder={t('application.enterInstitution', language)}
                  />
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label" htmlFor="income">{t('application.income', language)}</label>
                    <select
                      id="income"
                      className="form-select"
                      value={formData.eligibilityDetails.annualIncome}
                      onChange={(e) => updateEligibility('annualIncome', e.target.value)}
                    >
                      <option value="Below ₹1 lakh">{t('form.below1', language)}</option>
                      <option value="Below ₹2.5 lakh">{t('form.below25', language)}</option>
                      <option value="₹2.5 – ₹5 lakh">{t('form.25to5', language)}</option>
                      <option value="Above ₹5 lakh">{t('form.above5', language)}</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label" htmlFor="category">{t('application.category', language)}</label>
                    <select
                      id="category"
                      className="form-select"
                      value={formData.eligibilityDetails.category}
                      onChange={(e) => updateEligibility('category', e.target.value)}
                    >
                      <option value="General">{t('form.general', language)}</option>
                      <option value="OBC">{t('form.obc', language)}</option>
                      <option value="SC">{t('form.sc', language)}</option>
                      <option value="ST">{t('form.st', language)}</option>
                    </select>
                  </div>
                </div>
              </>
            )}

            {currentStep === 2 && (
              <>
                <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)', marginBottom: 'var(--space-5)' }}>
                  {t('application.selectDocuments', language, { documents: service.documents.join(', ') })}
                </p>
                <div className="doc-select-list">
                  {documents.map((doc) => {
                    const localizedDoc = localizeDocument(doc, language);
                    return (
                    <label
                      key={doc.id}
                      className={`doc-select-item ${formData.selectedDocuments.includes(doc.id) ? 'selected' : ''}`}
                    >
                      <input
                        type="checkbox"
                        checked={formData.selectedDocuments.includes(doc.id)}
                        onChange={() => toggleDocument(doc.id)}
                      />
                      <div>
                        <div style={{ fontWeight: 500 }}>{localizedDoc.name}</div>
                        <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)' }}>
                          {t(`documents.${doc.status}`, language)} · {t('common.updated', language)} {doc.updatedAt}
                        </div>
                      </div>
                    </label>
                    );
                  })}
                </div>
              </>
            )}

            {currentStep === 3 && (
              <>
                <div className="review-section">
                  <h3>{t('application.personal', language)}</h3>
                  <div className="review-row">
                    <span className="review-label">{t('application.name', language)}</span>
                    <span className="review-value">
                      {formData.personalDetails.firstName} {formData.personalDetails.lastName}
                    </span>
                  </div>
                  <div className="review-row">
                    <span className="review-label">{t('profile.dob', language)}</span>
                    <span className="review-value">{formData.personalDetails.dateOfBirth}</span>
                  </div>
                  <div className="review-row">
                    <span className="review-label">{t('profile.mobile', language)}</span>
                    <span className="review-value">{formData.personalDetails.mobile}</span>
                  </div>
                  <div className="review-row">
                    <span className="review-label">{t('profile.email', language)}</span>
                    <span className="review-value">{formData.personalDetails.email}</span>
                  </div>
                </div>
                <div className="review-section">
                  <h3>{t('application.eligibilityDetails', language)}</h3>
                  <div className="review-row">
                    <span className="review-label">{t('profile.education', language)}</span>
                    <span className="review-value">{formData.eligibilityDetails.educationLevel}</span>
                  </div>
                  <div className="review-row">
                    <span className="review-label">{t('application.income', language)}</span>
                    <span className="review-value">{formData.eligibilityDetails.annualIncome}</span>
                  </div>
                </div>
                <div className="review-section">
                  <h3>{t('application.documentCount', language, { count: formData.selectedDocuments.length })}</h3>
                  {formData.selectedDocuments.map((docId) => {
                    const doc = documents.find((d) => d.id === docId);
                    const localizedDoc = doc ? localizeDocument(doc, language) : undefined;
                    return localizedDoc ? (
                      <div key={docId} className="review-row">
                        <span className="review-label">{localizedDoc.name}</span>
                        <span className="review-value">{t(`documents.${localizedDoc.status}`, language)}</span>
                      </div>
                    ) : null;
                  })}
                </div>
              </>
            )}

            {currentStep === 4 && (
              <div style={{ textAlign: 'center', padding: 'var(--space-6) 0' }}>
                <div style={{ fontSize: '2.5rem', marginBottom: 'var(--space-4)' }}>📋</div>
                <h3 style={{ fontSize: 'var(--font-size-lg)', fontWeight: 600, marginBottom: 'var(--space-3)' }}>
                  {t('application.ready', language)}
                </h3>
                <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>
                  {t('application.confirm', language)}
                </p>
              </div>
            )}
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 'var(--space-8)', paddingTop: 'var(--space-6)', borderTop: '1px solid var(--color-border-light)' }}>
            <Button
              variant="ghost"
              onClick={() => (currentStep > 0 ? setCurrentStep(currentStep - 1) : navigate(`/services/${service.id}`))}
            >
              {currentStep === 0 ? t('common.cancel', language) : t('common.back', language)}
            </Button>
            {currentStep < 4 ? (
              <Button
                variant="primary"
                onClick={() => setCurrentStep(currentStep + 1)}
                disabled={!canProceed()}
              >
                {t('common.next', language)}
              </Button>
            ) : (
              <Button variant="accent" onClick={handleSubmit}>
                {t('common.submit', language)}
              </Button>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
