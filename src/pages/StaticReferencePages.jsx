import { Link } from 'react-router-dom';

const seoText = [
  'ArGen (Base44) is the world’s leading AI prompt engineering platform where developers, marketers, creators, and AI enthusiasts master the art of crafting effective prompts for AI systems like ChatGPT, Claude, Gemini, and other large language models.',
  'Learn prompt engineering through our structured challenge system featuring real-world prompt engineering challenges across reasoning, creative writing, code generation, marketing copywriting, automation workflows, and product design.',
  'Our AI prompt generator and learning platform combines theoretical knowledge with hands-on practice. Master prompt patterns, context optimization, token efficiency, and practical AI workflows.',
];

function Page({ title, subtitle, children }) {
  return (
    <main className="argen-page">
      <div className="argen-page-inner">
        <header className="mb-12">
          <h1 className="argen-page-title">{title}</h1>
          {subtitle && <p className="argen-page-subtitle">{subtitle}</p>}
        </header>
        {children}
      </div>
    </main>
  );
}

function SeoBlock() {
  return (
    <section className="mt-12 space-y-6">
      {seoText.map((text) => (
        <p key={text} className="text-sm leading-7 opacity-80">
          {text}
        </p>
      ))}
      <div className="grid gap-6 md:grid-cols-2">
        <article className="argen-panel">
          <h2 className="text-2xl font-black">Prompt Engineering Learning</h2>
          <p className="mt-4 leading-7">Learn how to write effective ChatGPT prompts, optimize AI workflows, and master prompt patterns for reasoning, creativity, and coding tasks.</p>
        </article>
        <article className="argen-panel">
          <h2 className="text-2xl font-black">AI Challenges and Practice</h2>
          <p className="mt-4 leading-7">Practice prompt engineering with interactive AI challenges across multiple difficulty levels and get feedback on every prompt.</p>
        </article>
      </div>
    </section>
  );
}

export function AboutPage() {
  return (
    <Page title="About ArGen" subtitle="The world's leading platform for mastering prompt engineering">
      <section className="argen-panel mb-8">
        <h2 className="text-3xl font-black">OUR MISSION</h2>
        <p className="mt-5 leading-7">ArGen helps developers, engineers, and AI users master prompt engineering through structured learning, real-time feedback, and competitive challenges.</p>
        <p className="mt-4 leading-7">Prompt engineering is a fundamental skill in the AI era. ArGen turns that skill into measurable practice.</p>
      </section>
      <div className="grid gap-6 md:grid-cols-2">
        {[
          ['OUR VISION', 'Create the most comprehensive and effective platform for prompt engineering education.'],
          ['COMMUNITY FIRST', 'Build a global community of prompt engineers who learn, compete, and grow together.'],
          ['STRUCTURED LEARNING PATHS', 'Curated challenges organized in progressive courses.'],
          ['REAL-TIME AI FEEDBACK', 'Instant, detailed feedback on every prompt you write.'],
        ].map(([title, text]) => (
          <article key={title} className="argen-panel">
            <h3 className="text-xl font-black">{title}</h3>
            <p className="mt-4 leading-7">{text}</p>
          </article>
        ))}
      </div>
      <SeoBlock />
    </Page>
  );
}

export function ContactPage() {
  return (
    <Page title="Get in Touch" subtitle="Whether you're an individual, team, or enterprise, we're here to help you build systematic AI competence.">
      <div className="grid gap-6 md:grid-cols-2">
        <Link to="/business-onboarding" className="argen-panel block">
          <h3 className="text-2xl font-black">Team & Enterprise</h3>
          <p className="mt-4 leading-7">Looking to deploy ArGen across your organization? Apply for team access with custom onboarding.</p>
          <div className="mt-6 font-black">APPLY FOR TEAM ACCESS →</div>
        </Link>
        <article className="argen-panel">
          <h3 className="text-2xl font-black">Individual Support</h3>
          <p className="mt-4 leading-7">Questions about features, billing, or getting started? Use the form below.</p>
          <div className="mt-6 font-black">CONTACT FORM ↓</div>
        </article>
      </div>
      <section className="argen-panel mt-8">
        <h2 className="mb-6 text-3xl font-black">Send us a message</h2>
        <div className="grid gap-4">
          <input placeholder="Name" />
          <input placeholder="Email" />
          <input placeholder="Subject" />
          <textarea placeholder="Message" rows={6} />
          <button className="argen-action">Send Message</button>
        </div>
      </section>
      <div className="mt-8 grid gap-6 md:grid-cols-3">
        {[
          ['Direct Email', 'isiraglobal@gmail.com'],
          ['Follow Us', '@isira.club'],
          ['Response Times', 'Email support within 24 hours'],
        ].map(([title, text]) => (
          <article key={title} className="argen-panel">
            <h3 className="text-xl font-black">{title}</h3>
            <p className="mt-4 leading-7">{text}</p>
          </article>
        ))}
      </div>
    </Page>
  );
}

export function PrivacyPage() {
  return (
    <Page title="Privacy Policy" subtitle="Last updated: January 2025">
      <div className="space-y-6">
        {[
          ['YOUR PRIVACY MATTERS', 'At ArGen, we take your privacy seriously. This policy outlines how we collect, use, and protect your personal information.'],
          ['INFORMATION WE COLLECT', 'We collect only the information necessary to provide accounts, billing, team features, and prompt evaluation.'],
          ['HOW WE USE YOUR DATA', 'Your data helps us operate the platform, improve feedback quality, protect accounts, and support team reporting.'],
          ['DATA PRIVACY', 'Your prompt activity and account data are handled with clear access boundaries and practical security controls.'],
          ['YOUR RIGHTS', 'For access, correction, deletion, or questions, contact isiraglobal@gmail.com.'],
        ].map(([title, text]) => (
          <section key={title} className="argen-panel">
            <h2 className="text-2xl font-black">{title}</h2>
            <p className="mt-4 leading-7">{text}</p>
          </section>
        ))}
      </div>
    </Page>
  );
}

export function TermsPage() {
  const sections = [
    ['1. ACCEPTANCE OF TERMS', 'By accessing and using ArGen, you accept and agree to be bound by these terms.'],
    ['2. DESCRIPTION OF SERVICE', 'ArGen provides an interactive platform for learning and practicing prompt engineering through challenges, courses, and AI-powered feedback.'],
    ['3. USER ACCOUNTS', 'You are responsible for account security and accurate account information.'],
    ['4. SUBSCRIPTION & BILLING', 'Paid plans renew according to the selected billing cycle unless cancelled.'],
    ['5. USER CONTENT & CONDUCT', 'You retain ownership of your content and agree not to misuse the service.'],
    ['6. INTELLECTUAL PROPERTY', 'ArGen platform materials, branding, and challenge content remain protected.'],
    ['7. AI-GENERATED CONTENT', 'AI feedback is provided as guidance and may contain errors or inaccuracies.'],
    ['8. DISCLAIMERS', 'The service is provided as is and as available without warranties of any kind.'],
    ['9. LIMITATION OF LIABILITY', 'ArGen shall not be liable for indirect, incidental, special, consequential, or punitive damages.'],
    ['10. INDEMNIFICATION', 'You agree to indemnify ArGen from claims connected with your use of the service.'],
  ];

  return (
    <Page title="Terms of Service" subtitle="Last Updated: January 2025">
      <div className="space-y-6">
        {sections.map(([title, text]) => (
          <section key={title} className="argen-panel">
            <h2 className="text-2xl font-black">{title}</h2>
            <p className="mt-4 leading-7">{text}</p>
          </section>
        ))}
      </div>
    </Page>
  );
}

export function DownloadPage() {
  return (
    <Page title="Download" subtitle="Install ArGen mobile workflows and keep practice close to daily work.">
      <section className="argen-panel">
        <h2 className="text-3xl font-black">Mobile Guide</h2>
        <p className="mt-4 leading-7">Use the mobile app pattern to jump between Home, Evaluate, and Profile from the bottom bar.</p>
        <Link to="/challenges" className="argen-action mt-6 inline-flex">Start Evaluating</Link>
      </section>
    </Page>
  );
}
