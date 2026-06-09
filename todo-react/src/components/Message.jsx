export default function Message({ text }) {
  if (!text) return null;
  return (
    <p className="rounded-md bg-red-50 px-3 py-2 text-xs text-red-500">
      {text}
    </p>
  );
}
