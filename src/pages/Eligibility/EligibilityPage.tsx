import { useState } from 'react';
import { useParams, useNavigate, Link, Navigate } from 'react-router-dom';
import { getServiceById, checkEligibility } from '../../services/dataService';
import { Card, Button, InfoBox } from '../../components/common';
import { useApp } from '../../context/AppContext';
import { localizeService, t } from '../../utils/i18n';
import type { EligibilityAnswers } from '../../types';

type Step = 'studying' | 'education' | 'income' | 'location' | 'employment' | 'age' | 'result';

export function EligibilityPage() {
  const { serviceId } = useParams<{ serviceId: string }>();
  const navigate = useNavigate();
  const { language } = useApp();
  const rawService = serviceId ? getServiceById(serviceId) : undefined;
  const service = rawService ? localizeService(rawService, language) : undefined;

  const [answers, setAnswers] = useState<EligibilityAnswers>({});
  const [step, setStep] = useState<Step>(
    service?.department === 'education' ? 'studying' : 'age'
  );

  if (!service) {
    return <Navigate to="/search" replace />;
  }

  const isEducation = service.department === 'education';

  const updateAnswer = (key: keyof EligibilityAnswers, value: string | boolean) => {
    setAnswers((prev) => ({ ...prev, [key]: value }));
  };

  const goNext = (nextStep: Step) => setStep(nextStep);

  const handleEducationFlow = () => {
    if (step === 'studying') goNext('education');
    else if (step === 'education') goNext('income');
    else if (step === 'income') goNext('location');
    else if (step === 'location') setStep('result');
  };

  const handleEmployabilityFlow = () => {
    if (step === 'age') goNext('location');
    else if (step === 'location') goNext('employment');
    else if (step === 'employment') goNext('education');
    else if (step === 'education') setStep('result');
  };

  const result = step === 'result' ? checkEligibility(service.id, answers, language) : null;

  const stepNumber = isEducation
    ? ['studying', 'education', 'income', 'location'].indexOf(step) + 1
    : ['age', 'location', 'employment', 'education'].indexOf(step) + 1;

  return (
    <div className="container">
      <div className="eligibility-layout">
        <div className="page-header" style={{ textAlign: 'center' }}>
          <h1 className="page-title">{t('eligibility.title', language)}</h1>
          <p className="page-subtitle">{service.title}</p>
        </div>

        {step !== 'result' && (
          <div className="eligibility-progress">
            <span className="eligibility-progress-num">{String(stepNumber).padStart(2, '0')}</span>
            <span className="eligibility-progress-sep">/</span>
            <span className="eligibility-progress-total">04</span>
          </div>
        )}

        <Card>
          {step === 'studying' && (
            <div className="animate-fade-in">
              <h2 className="eligibility-question">{t('eligibility.studying', language)}</h2>
              <div className="option-group">
                <button
                  className={`option-btn ${answers.currentlyStudying === true ? 'selected' : ''}`}
                  onClick={() => {
                    updateAnswer('currentlyStudying', true);
                    handleEducationFlow();
                  }}
                >
                  {t('eligibility.studyingYes', language)}
                </button>
                <button
                  className={`option-btn ${answers.currentlyStudying === false ? 'selected' : ''}`}
                  onClick={() => {
                    updateAnswer('currentlyStudying', false);
                    handleEducationFlow();
                  }}
                >
                  {t('eligibility.studyingNo', language)}
                </button>
              </div>
            </div>
          )}

          {step === 'education' && (
            <div className="animate-fade-in">
              <h2 className="eligibility-question">{t('eligibility.educationLevel', language)}</h2>
              <div className="option-group">
                {['10th', '12th', 'Graduate', 'Post Graduate'].map((level) => (
                  <button
                    key={level}
                    className={`option-btn ${answers.educationLevel === level ? 'selected' : ''}`}
                    onClick={() => {
                      updateAnswer('educationLevel', level);
                      isEducation ? handleEducationFlow() : handleEmployabilityFlow();
                    }}
                  >
                    {level === '10th' ? t('eligibility.10th', language) : level === '12th' ? t('eligibility.12th', language) : level === 'Graduate' ? t('eligibility.graduate', language) : t('eligibility.postGraduate', language)}
                  </button>
                ))}
              </div>
              <div style={{ marginTop: 'var(--space-4)' }}>
                <Button variant="ghost" onClick={() => setStep(isEducation ? 'studying' : 'employment')}>
                  {t('common.back', language)}
                </Button>
              </div>
            </div>
          )}

          {step === 'income' && (
            <div className="animate-fade-in">
              <h2 className="eligibility-question">{t('eligibility.income', language)}</h2>
              <div className="option-group">
                {[
                  { value: 'below-1L', label: t('eligibility.below1', language) }, { value: '1L-2.5L', label: t('eligibility.1to2', language) }, { value: '2.5L-5L', label: t('eligibility.2to5', language) }, { value: 'above-5L', label: t('eligibility.above5', language) },
                ].map((opt) => (
                  <button
                    key={opt.value}
                    className={`option-btn ${answers.annualIncome === opt.value ? 'selected' : ''}`}
                    onClick={() => {
                      updateAnswer('annualIncome', opt.value);
                      handleEducationFlow();
                    }}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
              <div style={{ marginTop: 'var(--space-4)' }}>
                <Button variant="ghost" onClick={() => setStep('education')}>
                  {t('common.back', language)}
                </Button>
              </div>
            </div>
          )}

          {step === 'age' && (
            <div className="animate-fade-in">
              <h2 className="eligibility-question">{t('eligibility.age', language)}</h2>
              <div className="option-group">
                {[
                  { value: '18-25', label: '18 – 25 years' },
                  { value: '26-35', label: '26 – 35 years' },
                  { value: '36-45', label: '36 – 45 years' },
                  { value: 'above-45', label: 'Above 45 years' },
                ].map((opt) => (
                  <button
                    key={opt.value}
                    className={`option-btn ${answers.age === opt.value ? 'selected' : ''}`}
                    onClick={() => {
                      updateAnswer('age', opt.value);
                      handleEmployabilityFlow();
                    }}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 'location' && (
            <div className="animate-fade-in">
              <h2 className="eligibility-question">{t('eligibility.location', language)}</h2>
              <div className="option-group">
                <button
                  className={`option-btn ${answers.location === 'maharashtra' ? 'selected' : ''}`}
                  onClick={() => {
                    updateAnswer('location', 'maharashtra');
                    isEducation ? handleEducationFlow() : handleEmployabilityFlow();
                  }}
                >
                  {t('eligibility.maharashtra', language)}
                </button>
                <button
                  className={`option-btn ${answers.location === 'other' ? 'selected' : ''}`}
                  onClick={() => {
                    updateAnswer('location', 'other');
                    isEducation ? handleEducationFlow() : handleEmployabilityFlow();
                  }}
                >
                  {t('eligibility.otherState', language)}
                </button>
              </div>
              <div style={{ marginTop: 'var(--space-4)' }}>
                <Button variant="ghost" onClick={() => setStep(isEducation ? 'income' : 'age')}>
                  {t('common.back', language)}
                </Button>
              </div>
            </div>
          )}

          {step === 'employment' && (
            <div className="animate-fade-in">
              <h2 className="eligibility-question">{t('eligibility.employment', language)}</h2>
              <div className="option-group">
                {[
                  { value: 'unemployed', label: t('eligibility.unemployed', language) }, { value: 'underemployed', label: t('eligibility.underemployed', language) }, { value: 'student', label: t('eligibility.student', language) }, { value: 'employed', label: t('eligibility.employed', language) },
                ].map((opt) => (
                  <button
                    key={opt.value}
                    className={`option-btn ${answers.employmentStatus === opt.value ? 'selected' : ''}`}
                    onClick={() => {
                      updateAnswer('employmentStatus', opt.value);
                      handleEmployabilityFlow();
                    }}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
              <div style={{ marginTop: 'var(--space-4)' }}>
                <Button variant="ghost" onClick={() => setStep('location')}>
                  {t('common.back', language)}
                </Button>
              </div>
            </div>
          )}

          {step === 'result' && result && (
            <div className="eligibility-result-card animate-fade-in">
              <div className={`eligibility-result-icon ${result.eligible ? 'eligible' : 'not-eligible'}`}>
                {result.eligible ? '✓' : '!'}
              </div>
              <h2 className="eligibility-result-title">
                {result.eligible
                  ? t('eligibility.eligible', language)
                  : t('eligibility.notEligible', language)}
              </h2>
              <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--font-size-sm)' }}>
                {result.summary}
              </p>

              <div className="eligibility-reasons">
                {result.reasons.map((reason, i) => (
                  <div key={i} className={`eligibility-reason ${reason.met ? 'met' : 'not-met'}`}>
                    <span>{reason.met ? '✓' : '○'}</span>
                    <span>{reason.text}</span>
                  </div>
                ))}
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)', marginTop: 'var(--space-6)' }}>
                <Button
                  variant="primary"
                  size="lg"
                  block
                  onClick={() => navigate(`/services/${service.id}/apply`)}
                >
                  {t('eligibility.toApplication', language)}
                </Button>
                <Link to={`/services/${service.id}`} style={{ textAlign: 'center' }}>
                  <Button variant="ghost" block>
                    {t('eligibility.backToService', language)}
                  </Button>
                </Link>
              </div>
            </div>
          )}
        </Card>

        {step !== 'result' && (
          <InfoBox variant="info">
            {t('eligibility.note', language)}
          </InfoBox>
        )}
      </div>
    </div>
  );
}
