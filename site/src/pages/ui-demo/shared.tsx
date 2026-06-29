export const pageTitle = (title: string) => (
  <h2 className="demo-section-title">{title}</h2>
);

export const pageDesc = (desc: string) => (
  <p className="ui-demo-desc">{desc}</p>
);

export const componentBlock = (children: React.ReactNode) => (
  <div className="ui-demo-block">{children}</div>
);
