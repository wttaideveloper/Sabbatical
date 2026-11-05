import { SectionCard } from "@/components/admin/Fields";
import MenuEditor from "@/components/admin/MenuEditor";
import SaveButton from "@/components/admin/SaveButton";
import PublishButton from "@/components/admin/PublishButton";
import StickyFormActions from "@/components/admin/StickyFormActions";
import StatusBanner from "@/components/admin/StatusBanner";
import { loadMenuItems, saveMenu } from "./actions";

export default async function MenuAdmin({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; error?: string }>;
}) {
  const { status, error } = await searchParams;
  const { data } = await loadMenuItems();
  const draftAction = saveMenu.bind(null, "draft");
  const publishAction = saveMenu.bind(null, "publish");

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="font-sans text-2xl font-semibold text-burgundy">Menu</h2>
        <StatusBanner status={status as "draft" | "published"} error={error} />
      </div>

      <form action={draftAction} className="flex flex-col gap-6">
        <SectionCard>
          <MenuEditor initialItems={data ?? []} />
          <StickyFormActions previewPath="/">
            <SaveButton label="Save Draft" />
            <PublishButton formAction={publishAction} />
          </StickyFormActions>
        </SectionCard>
      </form>
    </div>
  );
}
