type PageProps = {
  title: string;
  body: string;
  children: React.ReactNode;
};

export const Page = ({ title, body, children }: PageProps) => {
  return (
    <>
      <main className="flex min-h-screen flex-col gap-8 bg-slate-900 p-8 text-slate-50">
        <h1 className="text-center font-serif text-5xl">{title}</h1>
        <p className="text-center font-mono text-base">{body}</p>
        {children}
      </main>
    </>
  );
};
