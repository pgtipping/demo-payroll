import type { Meta, StoryObj } from "@storybook/react";
import { Badge } from "@/components/ui/badge";

const meta = {
  title: "Components/Badge",
  component: Badge,
  parameters: {
    layout: "centered",
    a11y: {
      config: {
        rules: [
          {
            id: "color-contrast",
            enabled: true,
          },
        ],
      },
    },
  },
  tags: ["autodocs"],
} satisfies Meta<typeof Badge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: "Badge",
  },
};

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-wrap gap-4">
      <Badge variant="default">Default</Badge>
      <Badge variant="secondary">Secondary</Badge>
      <Badge variant="destructive">Destructive</Badge>
      <Badge variant="success">Success</Badge>
      <Badge variant="warning">Warning</Badge>
      <Badge variant="outline">Outline</Badge>
    </div>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <Badge size="sm">Small</Badge>
      <Badge size="default">Default</Badge>
    </div>
  ),
};

export const WithCustomColors: Story = {
  render: () => (
    <div className="flex gap-4">
      <Badge className="bg-blue-800 text-white hover:bg-blue-900">
        Custom Blue
      </Badge>
      <Badge className="bg-purple-800 text-white hover:bg-purple-900">
        Custom Purple
      </Badge>
    </div>
  ),
};
