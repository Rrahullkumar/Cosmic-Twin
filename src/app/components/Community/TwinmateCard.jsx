export default function TwinmateCard({ twinmate }) {
  const { name, planet, compatibility, avatar } = twinmate;

  return (
    <div className="flex items-center gap-4 cursor-pointer hover:bg-gray-50 p-2 rounded-xl transition-colors">
      <div
        className="h-12 w-12 rounded-full bg-cover bg-center flex-shrink-0"
        style={{ backgroundImage: `url("${avatar}")` }}
      />
      <div className="flex-grow min-w-0">
        <p className="text-[var(--dark-text)] text-base font-bold break-words">{name}</p>
        <p className="text-[var(--subtle-text)] text-sm">{planet} · {compatibility}</p>
      </div>
    </div>
  );
}
