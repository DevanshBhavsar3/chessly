export function TypographySmall(props: { children: React.ReactNode }) {
  return (
    <small className="text-sm font-medium leading-none">{props.children}</small>
  );
}
