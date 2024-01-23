type PageProps = {
  title: string;
  body?: string;
  loading?: string;
  error?: string;
  children: React.ReactNode;
};

export const Page = ({ title, body, loading, error, children }: PageProps) => (
  <section className="flex min-h-screen flex-col items-center gap-8 bg-slate-900 p-8 text-slate-50">
    <h1 className="font-pacifico text-center text-5xl">{title}</h1>
    {body && <p className="font-raleway text-center text-base">{body}</p>}
    {loading ? <div>{loading}</div> : error ? <div>{error}</div> : <>{children}</>}
  </section>
);
