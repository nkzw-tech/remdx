export default function Image({
  src: source,
  ...props
}: React.DetailedHTMLProps<
  React.ImgHTMLAttributes<HTMLImageElement>,
  HTMLImageElement
>) {
  if (!source) {
    return null;
  }
  const [src, query] = source.split('?');
  return (
    <img
      loading="lazy"
      src={src}
      style={Object.fromEntries(new URLSearchParams(query))}
      {...props}
    />
  );
}
