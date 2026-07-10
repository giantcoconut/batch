import Link from 'next/link';

import { AppShell } from '@/components/app/app-shell';

export const dynamic = 'force-dynamic';

const reviewRows = [
  { name: 'Knowledge Garden', type: 'Thing', status: 'Ready' },
  { name: 'saulo.eth', type: 'Person', status: 'Existing' },
  { name: 'Open data builders', type: 'Organization', status: 'Ready' },
];

const benefits = [
  {
    number: '01',
    title: 'Create at your scale',
    description: 'Start with one atom when that is all you need. Add rows or import a CSV when the job gets bigger.',
  },
  {
    number: '02',
    title: 'See the outcome first',
    description: 'Every row is validated and classified before a wallet signature enters the picture.',
  },
  {
    number: '03',
    title: 'Write once with intent',
    description: 'Eligible atoms or list entries are prepared into one focused transaction while blocked rows stay out.',
  },
];

const flowSteps = [
  ['Prepare', 'Enter one item or bring the whole CSV.'],
  ['Resolve', 'Find existing atoms and duplicate entries.'],
  ['Review', 'Know exactly what is ready or blocked.'],
  ['Publish', 'Sign only the eligible protocol writes.'],
];

function ArrowIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.7" className="h-4 w-4">
      <path d="M4 10h11" />
      <path d="m11 6 4 4-4 4" />
    </svg>
  );
}

function ReviewBoard() {
  return (
    <div className="home-visual relative mx-auto mt-14 h-[25rem] w-full max-w-5xl sm:h-[28rem]">
      <div className="home-glow absolute inset-x-[5%] top-10 h-72 rounded-[50%] blur-3xl sm:inset-x-[12%]" />

      <div className="home-float-slow absolute left-[3%] top-28 hidden w-52 -rotate-6 rounded-[1.4rem] border border-white/50 bg-white/75 p-4 shadow-[0_30px_80px_rgba(27,20,40,0.14)] backdrop-blur-xl md:block">
        <div className="flex items-center justify-between">
          <span className="text-[0.62rem] uppercase tracking-terminal text-muted">Duplicate check</span>
          <span className="h-2.5 w-2.5 rounded-full bg-warning" />
        </div>
        <p className="mt-8 text-sm font-medium text-ink">Nothing accidental gets through.</p>
      </div>

      <div className="home-float absolute right-[4%] top-4 hidden w-48 rotate-6 rounded-[1.4rem] border border-white/50 bg-ink p-4 text-paper shadow-[0_30px_80px_rgba(27,20,40,0.2)] md:block">
        <p className="text-[0.62rem] uppercase tracking-terminal text-paper/55">Transaction</p>
        <p className="mt-8 font-serif text-3xl leading-none">2 ready</p>
        <p className="mt-2 text-xs text-paper/60">1 safely skipped</p>
      </div>

      <div className="home-board absolute left-1/2 top-12 w-[min(92%,42rem)] -translate-x-1/2 overflow-hidden rounded-[1.6rem] border border-white/60 bg-white/88 shadow-[0_40px_110px_rgba(45,25,55,0.2)] backdrop-blur-2xl">
        <div className="flex items-center justify-between border-b border-line/70 px-5 py-4 sm:px-6">
          <div>
            <p className="text-[0.62rem] uppercase tracking-terminal text-muted">Review queue</p>
            <p className="mt-1 text-sm font-medium text-ink">Your batch before it reaches the chain</p>
          </div>
          <span className="rounded-full bg-accentSoft px-3 py-1 text-xs font-medium text-ink">2 eligible</span>
        </div>

        <div className="divide-y divide-line/60 px-3 sm:px-4">
          {reviewRows.map((row, index) => (
            <div key={row.name} className="grid grid-cols-[2rem_minmax(0,1fr)_auto] items-center gap-3 px-2 py-4 sm:grid-cols-[2.5rem_minmax(0,1fr)_7rem_auto]">
              <span className="flex h-8 w-8 items-center justify-center rounded-full border border-line bg-paper text-xs text-muted">
                {index + 1}
              </span>
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-ink">{row.name}</p>
                <p className="mt-0.5 text-xs text-muted sm:hidden">{row.type}</p>
              </div>
              <span className="hidden text-xs text-muted sm:block">{row.type}</span>
              <span
                className={`rounded-full px-2.5 py-1 text-[0.65rem] font-medium ${
                  row.status === 'Ready' ? 'bg-accentSoft text-ink' : 'bg-paper text-muted'
                }`}
              >
                {row.status}
              </span>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between border-t border-line/70 bg-paper/55 px-5 py-4 sm:px-6">
          <p className="text-xs text-muted">Only eligible rows will be submitted.</p>
          <span className="rounded-full bg-ink px-4 py-2 text-xs font-medium text-paper">Publish 2 atoms</span>
        </div>
      </div>
    </div>
  );
}

export default function HomePage() {
  return (
    <AppShell fullBleed>
      <main className="overflow-hidden border-t border-line/70 bg-white/70">
        <section className="relative px-5 pb-4 pt-16 text-center sm:px-8 sm:pt-24">
          <div className="home-reveal mx-auto max-w-5xl">
            <p className="font-serif text-lg italic text-muted sm:text-xl">One atom or one thousand.</p>
            <h1 className="mx-auto mt-5 max-w-4xl text-6xl font-semibold leading-[0.86] tracking-[-0.075em] text-ink sm:text-7xl lg:text-[6.7rem]">
              Create knowledge.
              <span className="block font-serif font-normal italic tracking-[-0.065em]">Skip the busywork.</span>
            </h1>
            <p className="mx-auto mt-7 max-w-2xl text-base leading-7 text-muted sm:text-lg sm:leading-8">
              A community workspace for creating Intuition atoms and lists with fast imports, visible duplicate checks,
              and no surprises before you sign.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/create"
                className="inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3 text-sm font-medium text-paper transition-transform duration-200 hover:-translate-y-0.5"
              >
                Start creating
                <ArrowIcon />
              </Link>
              <Link
                href="/docs"
                className="inline-flex items-center gap-2 rounded-full border border-line bg-white/70 px-6 py-3 text-sm font-medium text-ink transition-colors duration-150 hover:border-ink/30"
              >
                See how it works
              </Link>
            </div>
          </div>

          <ReviewBoard />
        </section>

        <section className="border-t border-line/70 bg-white px-5 py-24 sm:px-8 sm:py-32">
          <div className="mx-auto max-w-[82rem]">
            <div className="grid items-end gap-10 lg:grid-cols-[minmax(0,1.4fr)_minmax(18rem,0.6fr)]">
              <h2 className="max-w-4xl text-5xl font-semibold leading-[0.92] tracking-[-0.065em] text-ink sm:text-7xl lg:text-[5.8rem]">
                Designed to help you publish more
                <span className="font-serif font-normal italic"> with less friction.</span>
              </h2>
              <p className="max-w-md text-base leading-8 text-muted lg:pb-2">
                Built for contributors who care about clean data but would rather not create it one repetitive form at a
                time.
              </p>
            </div>

            <div className="mt-20 grid border-y border-line/80 md:grid-cols-3">
              {benefits.map((benefit, index) => (
                <article
                  key={benefit.title}
                  className={`py-7 md:px-7 ${index > 0 ? 'border-t border-line/80 md:border-l md:border-t-0' : ''}`}
                >
                  <p className="font-mono text-[0.65rem] text-muted">{benefit.number}</p>
                  <h3 className="mt-8 text-lg font-medium text-ink">{benefit.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-muted">{benefit.description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="px-5 pb-8 sm:px-8">
          <div className="home-pipeline relative mx-auto max-w-[86rem] overflow-hidden rounded-[2rem] bg-ink px-6 py-16 text-paper sm:px-10 sm:py-20 lg:px-16">
            <div className="absolute -right-32 -top-52 h-[34rem] w-[34rem] rounded-full bg-accent opacity-90 blur-[1px]" />
            <div className="absolute -right-12 top-8 h-52 w-52 rounded-full bg-white/75 blur-3xl" />

            <div className="relative grid gap-16 lg:grid-cols-[minmax(20rem,0.75fr)_minmax(0,1.25fr)] lg:gap-24">
              <div>
                <p className="text-[0.7rem] uppercase tracking-terminal text-paper/55">Before the signature</p>
                <h2 className="mt-5 max-w-xl text-5xl font-semibold leading-[0.9] tracking-[-0.06em] sm:text-6xl">
                  From rough input to a deliberate write.
                </h2>
                <p className="mt-6 max-w-md text-sm leading-7 text-paper/65">
                  The workspace does the repetitive checking up front so your wallet approval is the final step rather
                  than the first leap of faith.
                </p>
                <Link
                  href="/create"
                  className="mt-8 inline-flex items-center gap-2 rounded-full bg-accent px-5 py-3 text-sm font-medium text-black transition-transform duration-200 hover:-translate-y-0.5"
                >
                  Open the workspace
                  <ArrowIcon />
                </Link>
              </div>

              <div className="relative divide-y divide-paper/15 border-y border-paper/20">
                {flowSteps.map(([title, description], index) => (
                  <div key={title} className="grid gap-3 py-5 sm:grid-cols-[2.5rem_7rem_minmax(0,1fr)] sm:items-center">
                    <span className="font-mono text-xs text-accent">0{index + 1}</span>
                    <h3 className="text-base font-medium text-paper">{title}</h3>
                    <p className="text-sm leading-6 text-paper/60">{description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>
    </AppShell>
  );
}
