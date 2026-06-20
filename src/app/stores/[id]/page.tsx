import type { Metadata } from "next";

import { StoreDetailView } from "@/features/stores/components/store-detail-view";
import { getStoreById } from "@/services/store.service";

interface StoreDetailPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({
  params,
}: StoreDetailPageProps): Promise<Metadata> {
  const { id } = await params;

  try {
    const store = await getStoreById(id);
    return {
      title: store
        ? `${store.name} · Retail Analytics`
        : "Store not found · Retail Analytics",
    };
  } catch {
    return { title: "Store · Retail Analytics" };
  }
}

export default async function StoreDetailPage({
  params,
}: StoreDetailPageProps) {
  const { id } = await params;

  return <StoreDetailView storeId={id} />;
}
