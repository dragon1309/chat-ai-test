import Icon from "./Icon";

export function Sidebar() {
  return (
    <aside className="w-[68px] bg-[rgb(242,245,253)] border-r border-gray-200 flex flex-col items-center py-6 space-y-8">
      <nav className="flex flex-col items-center">
        <SidebarIcon href="/src/assets/icon-navigation.svg#home" label="Home" />
        <SidebarIcon
          href="/src/assets/icon-navigation.svg#docs"
          label="Document"
        />
        <SidebarIcon
          href="/src/assets/icon-navigation.svg#design"
          label="Design"
        />
        <SidebarIcon
          href="/src/assets/icon-navigation.svg#presentation"
          label="Presentation"
        />
        <SidebarIcon
          href="/src/assets/icon-navigation.svg#gallery"
          label="Image"
        />
        <SidebarIcon
          href="/src/assets/icon-navigation.svg#video"
          label="Video"
        />
        <SidebarIcon href="/src/assets/icon-commons.svg#3-dots" label="More" />
        <SidebarIcon
          href="/src/assets/icon-navigation.svg#templates"
          label="Templates"
        />
        <SidebarIcon
          href="/src/assets/icon-navigation.svg#brand"
          label="Brand"
        />
        <SidebarIcon
          href="/src/assets/icon-navigation.svg#folder-open"
          label="Projects"
        />
      </nav>
      <div className="flex-1" />
      <div className="flex flex-col items-center space-y-4 pt-6 border-t border-gray-200">
        <SidebarIcon
          href="/src/assets/icon-commons.svg#solar-login"
          label="Sign in"
        />
        <div className="flex flex-col items-center space-y-2">
          <button className="group w-12 h-12 rounded-[3.40282e38px] bg-[rgb(30,13,255)] hover:bg-[rgb(20,8,200)] flex items-center justify-center transition-all hover:scale-105 hover:shadow-lg">
            <Icon
              href="/src/assets/icon-commons.svg#crown"
              size={20}
              className="text-white"
            />
          </button>
          <span className="sidebar-text text-[#6b7280] group-hover:text-[#4b5563] transition-colors">
            Upgrade
          </span>
        </div>
      </div>
    </aside>
  );
}

function SidebarIcon({ href, label }: { href: string; label: string }) {
  return (
    <div className="relative group flex items-center justify-center h-[53px]">
      <button
        className="flex flex-col items-center justify-center text-gray-600 hover:text-gray-900 transition-colors"
        title={label}
      >
        <Icon href={href} size={20} />
        <span className="sidebar-text">{label}</span>
      </button>
      {/* Tooltip */}
      <span className="absolute left-full ml-2 whitespace-nowrap rounded-md bg-gray-900 px-2 py-1 text-xs text-white opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
        {label}
      </span>
    </div>
  );
}
