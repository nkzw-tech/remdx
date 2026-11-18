export default function Image({
  alt = '',
  src: source,
  ...props
}: React.DetailedHTMLProps<React.ImgHTMLAttributes<HTMLImageElement>, HTMLImageElement>) {
  if (!source) {
    return null;
  }
  const [src, query] = source.split('?');
  return (
    <img
      alt={alt}
      loading="eager"
      src={src}
      style={Object.fromEntries(new URLSearchParams(query))}
      {...props}
    />
  );
}
