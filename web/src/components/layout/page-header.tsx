type PageHeaderProps = {
  title: string;
  description?: string;
};

export function PageHeader({ title, description }: PageHeaderProps) {
  return (
    <div className="space-y-2">
      <h1 className="text-2xl font-semibold tracking-tight text-paper">{title}</h1>
      {description ? <p className="text-mist">{description}</p> : null}
    </div>
  );
}
