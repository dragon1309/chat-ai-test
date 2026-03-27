import { useChat } from "../hooks/useChat";

export function Header() {
  const { isLoading } = useChat();

  return (
    <header
      id="header"
      className="bg-[rgb(249 250 254)] pl-0 xl:pl-[68px] py-4 flex items-center justify-between"
    >
      <div
        id="header-container"
        className="px-0 xl:px-12 flex-1 flex items-center justify-between"
      >
        <div id="logo" className="flex items-center space-x-4">
          <img
            src="/src/assets/new-logo.svg"
            alt="Template.net Logo"
            className="h-6 w-auto"
          />
        </div>

        <div className="flex items-center space-x-4">
          {isLoading && (
            <div className="flex items-center space-x-2 text-gray-500">
              <img
                src="/src/assets/loading-icon.svg"
                alt="Loading"
                className="h-5 w-5 animate-spin-slow"
              />
              <span className="font-medium">Generating...</span>
            </div>
          )}

          <button className="p-2 hover:bg-gray-100 rounded-lg">
            <svg
              className="w-5 h-5 text-gray-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </button>

          <button className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg header-btn">
            Pricing
          </button>

          <button className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg header-btn">
            Sign up
          </button>
        </div>
      </div>
    </header>
  );
}
