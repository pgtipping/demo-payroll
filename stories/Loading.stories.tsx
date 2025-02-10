import type { Meta, StoryObj } from "@storybook/react";
import {
  Loading,
  PageLoading,
  ButtonLoading,
  Spinner,
  ContentLoader,
} from "@/components/ui/loading";

const meta = {
  title: "Components/Loading",
  component: Loading,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof Loading>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    size: 24,
  },
};

export const WithText: Story = {
  args: {
    size: 24,
    text: "Loading...",
  },
};

export const AllLoadingStates = {
  render: () => (
    <div className="space-y-8">
      <div>
        <h3 className="mb-4 text-sm font-medium">Default Loading</h3>
        <Loading />
      </div>

      <div>
        <h3 className="mb-4 text-sm font-medium">Page Loading</h3>
        <div className="h-[200px]">
          <PageLoading />
        </div>
      </div>

      <div>
        <h3 className="mb-4 text-sm font-medium">Button Loading</h3>
        <button className="px-4 py-2 bg-primary text-primary-foreground font-semibold rounded-md inline-flex items-center gap-2">
          <ButtonLoading />
          <span className="text-primary-foreground">Saving...</span>
        </button>
      </div>

      <div>
        <h3 className="mb-4 text-sm font-medium">Spinner</h3>
        <Spinner />
      </div>

      <div>
        <h3 className="mb-4 text-sm font-medium">Content Loader</h3>
        <ContentLoader />
      </div>
    </div>
  ),
};

export const CustomSizes: Story = {
  render: () => (
    <div className="flex items-center gap-8">
      <Loading size={16} />
      <Loading size={24} />
      <Loading size={32} />
      <Loading size={48} />
    </div>
  ),
};
