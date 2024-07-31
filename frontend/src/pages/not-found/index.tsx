export const NotFoundPage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 bg-gray-50">
      <div className="w-full max-w-lg text-center">
        <h1 className="mb-4 font-bold text-9xl text-emerald-700">404</h1>
        <h2 className="mb-4 text-3xl font-semibold text-emerald-900">Page not found</h2>
        <p className="mb-8 text-xl text-emerald-700">This page doesn't exist or was removed.</p>
        <a
          href="/"
          className="inline-block px-6 py-3 text-lg font-medium text-white transition duration-300 rounded bg-emerald-600 hover:bg-emerald-700"
        >
          Go back home
        </a>
      </div>
    </div>
  );
};
