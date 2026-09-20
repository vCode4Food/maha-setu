import { schemes } from '@/data/schemes'
import { services } from '@/data/services'
import { departments, departmentById } from '@/data/departments'
import { initialLifeEvents } from '@/data/misc'

export interface AIReply { text: string; chips?: string[]; link?: { label: string; to: string } }

/** Rule-based assistant grounded in local mock data. No external APIs. */
export function aiAnswer(input: string, ctx?: { userName?: string }): AIReply {
  const q = input.toLowerCase()
  const has = (...words: string[]) => words.some((w) => q.includes(w))

  /* greeting */
  if (has('hello', 'hi ', 'hey', 'namaste') && q.length < 24) {
    return {
      text: `Namaste${ctx?.userName ? ` ${ctx.userName}` : ''}! I can help you discover services, check scheme eligibility, explain documents, or track what's pending. What are you working on?`,
      chips: ['What schemes am I eligible for?', 'How do I apply for an income certificate?', 'Why is my application pending?'],
    }
  }

  /* life events */
  const lifeEvent = initialLifeEvents.find((e) => e.id === q.trim().replaceAll(' ', '-'))
  if (lifeEvent) {
    return {
      text: `Great goal! Here's what "${lifeEvent.title.replace(/^I /, 'you ')}" involves: ${lifeEvent.needs.slice(0, 3).join(', ')}. MahaSetu coordinates ${lifeEvent.departments.length} departments for you — you never need to visit offices separately.`,
      link: { label: 'Open the guided journey', to: `/citizen/life-events/${lifeEvent.id}` },
      chips: ['What documents do I need?', 'How long does it take?'],
    }
  }

  /* eligibility */
  if (has('eligible', 'eligibility', 'scheme', 'yojana', 'benefit')) {
    const matched = schemes.slice(0, 3)
    const names = matched.map((s) => `• ${s.name} — ${s.benefit}`).join('\n')
    return {
      text: `Based on your Maha ID profile (Pune, 24, graduate, salaried household), these look relevant:\n${names}\n\nEligibility checks use only your vault documents and consents — demo simulation.`,
      link: { label: 'Open the eligibility checker', to: '/citizen/schemes' },
      chips: ['How do I apply for a scholarship?', 'What documents do I need?', 'Track my applications'],
    }
  }

  /* application status / pending */
  if (has('pending', 'status', 'delay', 'why is', 'track', 'stuck')) {
    return {
      text: 'Your Business Registration (MS-2026-004821) is at Officer Review — the Sub-Divisional Officer has had it since 15 Sep. Your Income Certificate (MS-2026-004798) is waiting on one document: a clearer self-declaration of income. Uploading it usually unblocks verification within a day.',
      link: { label: 'Track applications', to: '/citizen/applications' },
      chips: ['Upload the missing document', 'Why is verification slow?', 'Raise a grievance'],
    }
  }

  /* income certificate how-to */
  if (has('income certificate')) {
    const svc = services.find((s) => s.id === 'income-certificate')!
    return {
      text: `Income Certificate (Revenue Department, ₹${svc.fee}): apply online with your Maha ID. You need Aadhaar (masked), a self-declaration of income and optionally a ration card — two are already in your vault. Processing takes ${svc.processingTime}, and the e-certificate lands straight in your vault.`,
      link: { label: 'Apply now', to: '/citizen/services/income-certificate' },
      chips: ['What schemes need it?', 'Where do I upload documents?', 'Apply for scholarship'],
    }
  }

  /* business */
  if (has('business', 'startup', 'company', 'shop', 'entrepreneur')) {
    return {
      text: 'Starting a business needs 5 registrations across 4 departments: Business Registration (₹1,000), Trade Licence (₹500), GST Registration (free), plus labour and local approvals. One application — MahaSetu coordinates all departments in parallel, typically 3–5 weeks total.',
      link: { label: 'Open the "Starting a business" journey', to: '/citizen/life-events/starting-business' },
      chips: ['What documents do I need?', 'Are there schemes for startups?', 'How long does registration take?'],
    }
  }

  /* documents */
  if (has('document', 'upload', 'paper', 'certificate copy', 'vault')) {
    return {
      'text': 'Your vault holds 10 documents — 9 verified, 1 needs attention (self-declaration flagged as illegible). Upload once, reuse everywhere: every application pre-fills from the vault with your consent. To add one: Documents → Upload → pick category.',
      link: { label: 'Open Document Vault', to: '/citizen/documents' },
      chips: ['Which document is pending?', 'How does consent work?', 'Apply for income certificate'],
    }
  }

  /* consent/privacy */
  if (has('consent', 'privacy', 'data', 'share')) {
    return {
      text: 'Departments can only read specific vault items after you approve. Each consent shows who, what data, why, and for how long — and you can revoke any time. Currently 3 consents are active (Education, Revenue, Social Welfare).',
      link: { label: 'Review data permissions', to: '/citizen/consent' },
      chips: ['Revoke a consent', 'Who saw my documents?', 'What is Gist?'],
    }
  }

  /* grievances */
  if (has('grievance', 'complaint', 'escalate')) {
    return {
      text: 'GRV-2026-00231 (income certificate delay) is assigned to the Sub-Divisional Officer, Revenue — 60% of its 72-hour SLA used. If it breaches SLA, MahaSetu escalates automatically to the department head.',
      link: { label: 'Track grievances', to: '/citizen/grievances' },
      chips: ['Why is my application pending?', 'Raise a grievance', 'What is the SLA policy?'],
    }
  }

  /* gist */
  if (has('gist', 'summary', 'notice')) {
    return {
      text: 'Gist turns dense government language into six plain answers: Who is eligible, What do you get, What do you need, How do you apply, Deadline, Department. Look for the ✦ Gist button on notices, schemes and notifications.',
      chips: ['Show me a scheme with Gist', 'Latest government updates'],
    }
  }

  /* scheme-specific */
  const sch = schemes.find((s) => q.includes(s.name.toLowerCase().split(' ').slice(0, 2).join(' ')))
  if (sch) {
    return {
      text: `${sch.name} (${departmentById(sch.departmentId)?.shortName}): ${sch.benefit}. Deadline: ${sch.deadline}. You'd need: ${sch.documents.join(', ')}.`,
      link: { label: 'View scheme', to: '/citizen/schemes' },
    }
  }

  /* service search fallback */
  const svc = services.find((s) => q.includes(s.name.toLowerCase().split(' ').slice(0, 2).join(' ')))
  if (svc) {
    return {
      text: `${svc.name} — ${departmentById(svc.departmentId)?.shortName}, ₹${svc.fee}, ${svc.processingTime}. You'll need ${svc.documents.length} documents (most are in your vault already).`,
      link: { label: 'Open service', to: `/citizen/services/${svc.id}` },
      chips: ['What documents do I need?', 'How long does it take?', 'Apply now'],
    }
  }

  /* departments */
  if (has('department', 'rto', 'tehsil', 'municipal', 'office')) {
    return {
      text: `${departments.length} departments are connected to MahaSetu — Revenue, Transport, Health, Education, Agriculture, Municipal, Labour, Social Welfare, Finance, Police, Housing and Business Services. You don't need to know which one owns a service; MahaSetu routes it.`,
      link: { label: 'See departments', to: '/departments' },
    }
  }

  /* fallback */
  return {
    text: "I didn't find an exact match, but I can help with: finding a service, checking scheme eligibility, explaining documents, tracking an application, or guiding a life event. Try one of the suggestions below.",
    chips: ['What schemes am I eligible for?', 'I want to start a business', 'Why is my application pending?'],
  }
}
