type PageProps = {
  title: string;
  body?: string;
  children: React.ReactNode;
};

export const Page = ({ title, body, children }: PageProps) => (
  <section className="flex min-h-screen flex-col items-center gap-8 bg-slate-900 p-8 text-slate-50">
    <h1 className="font-pacifico text-center text-5xl">{title}</h1>
    {body && <p className="font-raleway text-center text-base">{body}</p>}
    {children}
  </section>
);
