export const Head = () => {
  return (
    <header>
      <div className="max-w-screen-xl py-8 sm:px-2 sm:py-12 lg:px-8">
        <div className="sm:flex sm:items-center sm:justify-between">
          <div className="text-center sm:text-left">
            <h1 className="text-2xl font-bold text-black sm:text-3xl">
              Document Search
            </h1>
            <p className="mt-1.5 text-sm text-black">
              You can search for your issued documents here.
            </p>
          </div>

          <div className="mt-4 flex flex-col gap-4 sm:mt-0 sm:flex-row sm:items-center"></div>
        </div>
      </div>
    </header>
  );
};
