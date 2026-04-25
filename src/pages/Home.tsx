import { Link } from 'react-router-dom';

const painPoints = [
  {
    quote: 'You typed something. AI gave a generic answer. You edited for 20 minutes anyway.',
    fix: 'A few extra words in your prompt would have saved you the edit entirely.',
  },
  {
    quote: 'You asked the same question twice and got two completely different answers.',
    fix: 'AI is not random. Vague prompts produce unpredictable outputs. Clear prompts do not.',
  },
  {
    quote: 'You asked Copilot to summarise this and got a wall of text that still missed the point.',
    fix: 'You needed to tell it what kind of summary, for whom, and how long. ArGen teaches that.',
  },
  {
    quote: 'Your colleague gets great AI answers. You get mediocre ones. Same tool, same company.',
    fix: 'The difference is not the tool. It is how they talk to it.',
  },
];

const skillCards = [
  {
    title: 'Short challenges',
    text: 'Each challenge takes 3-10 minutes. Real work tasks — writing, analysis, communication, decisions. You write a prompt, AI evaluates it, you see what to improve.',
  },
  {
    title: 'Instant, honest feedback',
    text: 'Not a score out of 10. Actual explanation: what your prompt lacked, what a better version looks like, why the AI responded the way it did.',
  },
  {
    title: 'Builds real habit',
    text: 'After 10 challenges you will notice you prompt differently without thinking. That is the point — skill, not theory.',
  },
];

const audiences = [
  ['Marketing & Content', 'Stop rewriting AI drafts. Get copy that is on-tone and on-brand, first try.'],
  ['HR & People Teams', 'Job descriptions, policies, comms — AI can draft all of it, when you prompt it correctly.'],
  ['Finance & Analysts', 'Summarise data, generate reports, extract insights faster with better queries.'],
  ['Operations & Admin', 'Templates, SOPs, emails — get useful first drafts instead of generic filler.'],
  ['Sales & Account Teams', 'Personalised outreach at scale. Better discovery questions. Cleaner proposals.'],
  ['Managers & Leaders', 'Delegate writing tasks to AI without losing quality. Know what to ask for.'],
];

const costs = [
  ['Time wasted on bad outputs (avg)', '~30 min/day'],
  ['Per month (22 work days)', '~11 hours'],
  ['Per year', '~130 hours'],
  ['Cost of ArGen (yearly)', '$90'],
];

const steps = [
  ['1', 'Pick a challenge', 'Choose a task type — writing, analysis, summarising, planning. Challenges match real work, not made-up examples. Takes 3-10 minutes each.'],
  ['2', 'Write your prompt', 'You write a prompt the way you normally would. No trick questions. No need to prepare.'],
  ['3', 'See exactly what to improve', 'The system evaluates your prompt and shows you what worked, what did not, and a better version. Your specific prompt, specific feedback.'],
];

const teamFeatures = [
  ['Team progress dashboard', 'See who is improving, who is not, and where the gaps are — per department, per role.'],
  ['Structured pilot program', '10-20 people, 3-4 weeks, clear metrics defined before you start. Data before any procurement decision.'],
  ['ROI reporting built in', 'Before/after skill scores, time saved, adoption rates. Formatted for leadership, not just HR.'],
  ['Data stays yours', 'Team reporting without turning AI training into surveillance. Clear skill signals, clean privacy boundaries.'],
];

export function Home() {
  return (
    <main className="argen-home min-h-screen bg-cream text-dark [&_p]:!mb-0">
      <style>{`
        body > div > header { display: none; }
        .argen-home {
          min-height: 100vh;
          background: #f5f1e8;
          color: #1a1a1a;
          font-family: 'Cascadia Mono', 'Cascadia Code', monospace;
        }
        .argen-home * {
          box-sizing: border-box;
          border-radius: 0;
          box-shadow: none;
        }
        .argen-home p,
        .argen-home h1,
        .argen-home h2,
        .argen-home h3 {
          margin: 0;
        }
        .argen-home section {
          padding: 80px 24px;
        }
        .argen-home section:first-of-type {
          padding-top: 48px;
          padding-bottom: 84px;
          text-align: center;
        }
        .argen-home section:nth-of-type(even) {
          background: #1a1a1a;
          color: #f5f1e8;
        }
        .argen-home section > div {
          max-width: 900px;
          margin: 0 auto;
        }
        .argen-home section:first-of-type > div {
          max-width: 620px;
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        .argen-home img[alt='ArGen'] {
          width: 32px;
          height: auto;
          margin-bottom: 58px;
          object-fit: contain;
        }
        .argen-home h1 {
          max-width: 620px;
          font-size: clamp(31px, 8vw, 58px);
          line-height: 1.12;
          font-weight: 900;
          letter-spacing: 0;
        }
        .argen-home h2 {
          font-size: clamp(30px, 5vw, 44px);
          line-height: 1.12;
          font-weight: 900;
          letter-spacing: 0;
          text-align: center;
        }
        .argen-home h3 {
          font-size: 20px;
          line-height: 1.2;
          font-weight: 900;
          letter-spacing: 0;
        }
        .argen-home p {
          font-size: 14px;
          line-height: 1.8;
        }
        .argen-home a {
          color: inherit;
          text-decoration: none;
        }
        .argen-home section:first-of-type h1 + p {
          margin-top: 34px;
          max-width: 610px;
        }
        .argen-home section:first-of-type p + p {
          margin-top: 28px;
          max-width: 560px;
        }
        .argen-home section:first-of-type a,
        .argen-home section:nth-of-type(6) a {
          display: inline-flex;
          margin-top: 34px;
          border: 3px solid #1a1a1a;
          background: #2d5f4f;
          color: #f5f1e8;
          padding: 12px 24px;
          font-size: 14px;
          line-height: 1;
          font-weight: 900;
        }
        .argen-home section:first-of-type a + p {
          margin-top: 28px;
          max-width: 520px;
          color: rgba(26, 26, 26, 0.7);
          font-size: 12px;
          line-height: 1.9;
        }
        .argen-home section:nth-of-type(2) > div > div:first-child,
        .argen-home section:nth-of-type(3) > div > div:first-child,
        .argen-home section:nth-of-type(4) > div > div:first-child,
        .argen-home section:nth-of-type(5) > div,
        .argen-home section:nth-of-type(6) > div > div:first-child,
        .argen-home section:nth-of-type(7) > div > div:first-child,
        .argen-home section:nth-of-type(7) > div > div:nth-child(2) {
          text-align: center;
        }
        .argen-home h2 + p {
          margin-top: 20px;
          color: inherit;
          opacity: 0.82;
          font-size: 16px;
        }
        .argen-home article {
          border: 3px solid #1a1a1a;
          background: #f5f1e8;
          color: #1a1a1a;
          padding: 24px;
        }
        .argen-home article p {
          margin-top: 16px;
          font-size: 14px;
          line-height: 1.75;
        }
        .argen-home article p:first-child {
          margin-top: 0;
        }
        .argen-home article p:first-child:not(:only-child) {
          font-weight: 900;
        }
        .argen-home section:nth-of-type(2) > div > div:last-child,
        .argen-home section:nth-of-type(4) > div > div:last-child,
        .argen-home section:nth-of-type(6) > div > div:nth-child(2),
        .argen-home section:nth-of-type(7) > div > div:last-child {
          display: grid;
          gap: 28px;
          margin-top: 48px;
        }
        .argen-home section:nth-of-type(3) > div > div:nth-child(2) {
          display: grid;
          gap: 28px;
          margin-top: 48px;
        }
        .argen-home section:nth-of-type(3) > div > div:last-child {
          margin-top: 56px;
          border: 3px solid #1a1a1a;
          padding: 32px;
          background: #f5f1e8;
        }
        .argen-home section:nth-of-type(3) > div > div:last-child p {
          margin-top: 12px;
        }
        .argen-home section:nth-of-type(3) > div > div:last-child p:nth-child(1),
        .argen-home section:nth-of-type(3) > div > div:last-child p:nth-child(3) {
          font-size: 13px;
          font-weight: 900;
        }
        .argen-home section:nth-of-type(3) > div > div:last-child p:nth-child(2),
        .argen-home section:nth-of-type(3) > div > div:last-child p:nth-child(4) {
          font-size: 18px;
          font-weight: 900;
          line-height: 1.6;
        }
        .argen-home section:nth-of-type(3) > div > div:last-child p:nth-child(3) {
          margin-top: 32px;
        }
        .argen-home section:nth-of-type(5) > div {
          max-width: 780px;
        }
        .argen-home section:nth-of-type(5) > div > p:nth-of-type(2) {
          margin-top: 32px;
          font-size: 18px;
          font-weight: 900;
        }
        .argen-home section:nth-of-type(5) > div > div {
          display: grid;
          margin-top: 36px;
          border: 3px solid #1a1a1a;
          text-align: left;
        }
        .argen-home section:nth-of-type(5) > div > div > div {
          border-bottom: 3px solid #1a1a1a;
          padding: 24px;
        }
        .argen-home section:nth-of-type(5) > div > div > div:last-child {
          border-bottom: 0;
        }
        .argen-home section:nth-of-type(5) > div > div p:first-child {
          font-size: 13px;
          line-height: 1.6;
        }
        .argen-home section:nth-of-type(5) > div > div p:last-child {
          margin-top: 8px;
          font-size: 28px;
          line-height: 1.1;
          font-weight: 900;
        }
        .argen-home section:nth-of-type(5) > div > p:last-child {
          margin-top: 28px;
          font-size: 16px;
          font-weight: 900;
        }
        .argen-home section:nth-of-type(6) article > div {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 48px;
          height: 48px;
          margin-bottom: 24px;
          border: 3px solid #1a1a1a;
          background: #2d5f4f;
          color: #f5f1e8;
          font-size: 22px;
          font-weight: 900;
        }
        .argen-home section:nth-of-type(6) > div > div:last-child {
          margin-top: 48px;
          text-align: center;
        }
        .argen-home section:nth-of-type(7) > div > div:first-child {
          max-width: 720px;
          margin: 0 auto;
        }
        .argen-home section:nth-of-type(7) > div > div:first-child p:first-child {
          font-size: 18px;
          line-height: 1.7;
          font-weight: 900;
        }
        .argen-home section:nth-of-type(7) > div > div:first-child p:last-child {
          margin-top: 16px;
          font-size: 13px;
        }
        .argen-home section:nth-of-type(7) > div > div:nth-child(2) {
          margin-top: 64px;
        }
        @media (min-width: 640px) {
          .argen-home section {
            padding-top: 96px;
            padding-bottom: 96px;
          }
          .argen-home section:nth-of-type(2) > div > div:last-child,
          .argen-home section:nth-of-type(4) > div > div:last-child,
          .argen-home section:nth-of-type(7) > div > div:last-child {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
          .argen-home section:nth-of-type(5) > div > div {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
          .argen-home section:nth-of-type(5) > div > div > div:nth-child(odd) {
            border-right: 3px solid #1a1a1a;
          }
          .argen-home section:nth-of-type(5) > div > div > div:nth-last-child(-n + 2) {
            border-bottom: 0;
          }
        }
        @media (min-width: 768px) {
          .argen-home section:nth-of-type(3) > div > div:nth-child(2),
          .argen-home section:nth-of-type(6) > div > div:nth-child(2) {
            grid-template-columns: repeat(3, minmax(0, 1fr));
          }
        }
        @media (min-width: 1024px) {
          .argen-home section:nth-of-type(4) > div > div:last-child {
            grid-template-columns: repeat(3, minmax(0, 1fr));
          }
        }
      `}</style>

      <section className="px-6 pb-24 pt-14 text-center sm:pb-28 sm:pt-20">
        <div className="mx-auto flex max-w-[560px] flex-col items-center">
          <img src="/logo.png" alt="ArGen" className="mb-16 h-6 w-auto object-contain sm:mb-20" />
          <h1 className="max-w-[620px] text-[38px] font-black leading-[1.08] tracking-normal sm:text-[58px]">
            You use AI every day.
            <br />
            Are you actually getting good answers?
          </h1>
          <p className="mt-10 max-w-[610px] text-[15px] font-normal leading-[1.8] sm:text-[17px]">
            Most people who use ChatGPT, Copilot, or Gemini for work spend extra time fixing bad outputs — without
            knowing what went wrong.
          </p>
          <p className="mt-8 max-w-[560px] text-[15px] leading-[1.8] sm:text-[17px]">
            ArGen teaches you how to ask AI better — so it gives you what you actually need, first time.
          </p>
          <Link
            to="/signup"
            className="mt-10 inline-flex border-[3px] border-dark bg-green px-6 py-3 text-[14px] font-black leading-none text-cream hover:opacity-90"
          >
            Try it free — no card needed
          </Link>
          <p className="mt-8 max-w-[520px] text-[11px] leading-[1.9] text-dark/70 sm:text-[12px]">
            Works with ChatGPT · Copilot · Gemini · Claude · Any AI tool
          </p>
        </div>
      </section>

      <section className="bg-dark px-6 py-20 text-cream sm:py-24">
        <div className="mx-auto max-w-[760px]">
          <div className="text-center">
            <h2 className="text-[28px] font-black leading-tight sm:text-[38px]">Sound familiar?</h2>
            <p className="mt-4 text-[14px] leading-[1.8] text-cream/80 sm:text-[16px]">
              These are not AI problems. They are prompting problems.
            </p>
          </div>
          <div className="mt-10 grid gap-7 sm:mt-12 sm:grid-cols-2">
            {painPoints.map((item) => (
              <article key={item.quote} className="border-[3px] border-dark bg-cream p-6 text-dark">
                <p className="text-[14px] font-black leading-[1.6]">"{item.quote}"</p>
                <p className="mt-4 text-[13px] leading-[1.7]">→ {item.fix}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 py-20 sm:py-24">
        <div className="mx-auto max-w-[860px]">
          <div className="text-center">
            <h2 className="text-[30px] font-black leading-tight sm:text-[44px]">What ArGen actually is</h2>
            <p className="mt-5 text-[15px] leading-[1.8] sm:text-[17px]">Not a course. Not a tutorial. A skill-building system.</p>
          </div>
          <div className="mt-12 grid gap-7 md:grid-cols-3">
            {skillCards.map((card) => (
              <article key={card.title} className="border-[3px] border-dark bg-cream p-6">
                <h3 className="text-[20px] font-black leading-tight">{card.title}</h3>
                <p className="mt-4 text-[14px] leading-[1.75]">{card.text}</p>
              </article>
            ))}
          </div>

          <div className="mt-14 border-[3px] border-dark bg-cream p-7 sm:p-9">
            <p className="text-[13px] font-black leading-[1.7]">X BEFORE (what most people type):</p>
            <p className="mt-3 text-[18px] font-black leading-[1.6]">"Write a summary of this meeting"</p>
            <p className="mt-8 text-[13px] font-black leading-[1.7]">AFTER (what ArGen teaches):</p>
            <p className="mt-3 text-[18px] font-black leading-[1.6]">
              "Summarise this meeting in 5 bullet points. Focus on action items and who is responsible. Write it for
              someone who was not in the meeting."
            </p>
            <p className="mt-6 text-[14px] leading-[1.8]">
              The second prompt produces something you can actually send. The first produces something you rewrite.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-dark px-6 py-20 text-cream sm:py-24">
        <div className="mx-auto max-w-[900px]">
          <div className="text-center">
            <h2 className="text-[30px] font-black leading-tight sm:text-[44px]">Who uses ArGen</h2>
            <p className="mt-5 text-[15px] leading-[1.8] text-cream/80 sm:text-[17px]">
              If you use AI for work, this is for you. No exceptions for industry or role.
            </p>
          </div>
          <div className="mt-12 grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
            {audiences.map(([title, text]) => (
              <article key={title} className="border-[3px] border-dark bg-cream p-6 text-dark">
                <h3 className="text-[19px] font-black leading-tight">{title}</h3>
                <p className="mt-4 text-[14px] leading-[1.75]">{text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 py-20 sm:py-24">
        <div className="mx-auto max-w-[780px] text-center">
          <h2 className="text-[30px] font-black leading-tight sm:text-[44px]">The real cost of bad prompting</h2>
          <p className="mt-5 text-[15px] leading-[1.8] sm:text-[17px]">Nobody talks about this. But it is real.</p>
          <p className="mt-8 text-[18px] font-black leading-tight">If you use AI for 2 hours/day...</p>
          <div className="mt-9 grid border-[3px] border-dark text-left sm:grid-cols-2">
            {costs.map(([label, value]) => (
              <div key={label} className="border-b-[3px] border-dark p-6 odd:sm:border-r-[3px] even:sm:border-r-0 sm:[&:nth-last-child(-n+2)]:border-b-0">
                <p className="text-[13px] leading-[1.6]">{label}</p>
                <p className="mt-2 text-[28px] font-black leading-tight">{value}</p>
              </div>
            ))}
          </div>
          <p className="mt-7 text-[16px] font-black leading-[1.7]">130 hours × your hourly value &gt;&gt; $90/year. Every time.</p>
        </div>
      </section>

      <section className="bg-dark px-6 py-20 text-cream sm:py-24">
        <div className="mx-auto max-w-[860px]">
          <div className="text-center">
            <h2 className="text-[30px] font-black leading-tight sm:text-[44px]">How it works — simply</h2>
            <p className="mt-5 text-[15px] leading-[1.8] text-cream/80 sm:text-[17px]">3 steps. No setup. No tutorial to read.</p>
          </div>
          <div className="mt-12 grid gap-7 md:grid-cols-3">
            {steps.map(([number, title, text]) => (
              <article key={title} className="border-[3px] border-dark bg-cream p-6 text-dark">
                <div className="mb-6 flex h-12 w-12 items-center justify-center border-[3px] border-dark bg-green text-[22px] font-black text-cream">
                  {number}
                </div>
                <h3 className="text-[20px] font-black leading-tight">{title}</h3>
                <p className="mt-4 text-[14px] leading-[1.75]">{text}</p>
              </article>
            ))}
          </div>
          <div className="mt-12 text-center">
            <Link
              to="/signup"
              className="inline-flex border-[3px] border-dark bg-green px-6 py-3 text-[14px] font-black leading-none text-cream hover:opacity-90"
            >
              Start your first challenge free
            </Link>
          </div>
        </div>
      </section>

      <section className="px-6 py-20 sm:py-24">
        <div className="mx-auto max-w-[900px]">
          <div className="mx-auto max-w-[720px] text-center">
            <p className="text-[18px] font-black leading-[1.7]">
              "For the first time, I could show leadership exactly how AI literacy improved across our 200-person team —
              with numbers."
            </p>
            <p className="mt-4 text-[13px] leading-[1.7]">— L&amp;D Manager, BFSI Sector</p>
          </div>
          <div className="mt-16 text-center">
            <h2 className="text-[30px] font-black leading-tight sm:text-[44px]">For Teams & Companies</h2>
            <p className="mt-5 text-[15px] leading-[1.8] sm:text-[17px]">
              Everything above, plus visibility, accountability, and ROI reporting for HR and leadership.
            </p>
          </div>
          <div className="mt-12 grid gap-7 sm:grid-cols-2">
            {teamFeatures.map(([title, text]) => (
              <article key={title} className="border-[3px] border-dark bg-cream p-6">
                <h3 className="text-[20px] font-black leading-tight">{title}</h3>
                <p className="mt-4 text-[14px] leading-[1.75]">{text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
