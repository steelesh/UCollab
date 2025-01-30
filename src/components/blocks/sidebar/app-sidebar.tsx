import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/src/components/ui/sidebar";
import {
  Code2,
  Home,
  Lightbulb,
  MessageSquare,
  MessagesSquare,
  Tags,
  TrendingUp,
  Users,
} from "lucide-react";

const mainNavItems = [
  {
    title: "Home",
    href: "/",
    icon: Home,
    description: "Return to homepage",
  },
  {
    title: "Q & A",
    href: "/questions",
    icon: MessageSquare,
    description: "Ask questions and help others",
  },
  {
    title: "Code Reviews",
    href: "/feedback",
    icon: Code2,
    description: "Get feedback on your code",
  },
  {
    title: "Collaborations",
    href: "/collaborations",
    icon: Users,
    description: "Find project teammates",
  },
  {
    title: "Mentorship",
    href: "/mentorship",
    icon: Lightbulb,
    description: "Connect with mentors",
  },
];

const discoverItems = [
  {
    title: "Discussions",
    href: "/discussions",
    icon: MessagesSquare,
    description: "Join community discussions",
  },
  {
    title: "Trending",
    href: "/trending",
    icon: TrendingUp,
    description: "See what's popular",
  },
  {
    title: "Tags",
    href: "/tags",
    icon: Tags,
    description: "Browse by topic",
  },
];

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarHeader className="border-border border-b px-4 py-2">
        {/* You can add a workspace switcher or other header content here */}
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Main Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainNavItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton asChild>
                    <a href={item.href}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Discover</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {discoverItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton asChild>
                    <a href={item.href}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
