export default function Loading() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="text-center">
        <div className="animate-spin h-10 w-10 border-3 border-blue-500 border-t-transparent rounded-full mx-auto mb-4" />
        <p className="text-sm text-zinc-400">Loading...</p>
      </div>
    </div>
  );
}
