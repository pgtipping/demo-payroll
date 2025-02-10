import type { Meta, StoryObj } from "@storybook/react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { UserIcon } from "lucide-react";

const meta = {
  title: "Components/Avatar",
  component: Avatar,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof Avatar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: [
      <AvatarImage
        key="img"
        src="https://github.com/shadcn.png"
        alt="@shadcn"
      />,
      <AvatarFallback key="fallback">CN</AvatarFallback>,
    ],

    size: "lg"
  },
};

export const WithSizes: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <Avatar size="sm">
        <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
        <AvatarFallback>CN</AvatarFallback>
      </Avatar>
      <Avatar size="md">
        <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
        <AvatarFallback>CN</AvatarFallback>
      </Avatar>
      <Avatar size="lg">
        <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
        <AvatarFallback>CN</AvatarFallback>
      </Avatar>
    </div>
  ),
};

export const WithFallback: Story = {
  args: {
    children: [
      <AvatarImage key="img" src="/broken-image.jpg" alt="@shadcn" />,
      <AvatarFallback key="fallback">CN</AvatarFallback>,
    ],
  },
};

export const WithIcon: Story = {
  args: {
    children: [
      <AvatarImage key="img" src="/broken-image.jpg" alt="@shadcn" />,
      <AvatarFallback key="fallback">
        <UserIcon className="h-4 w-4" />
      </AvatarFallback>,
    ],

    size: "lg"
  },
};
