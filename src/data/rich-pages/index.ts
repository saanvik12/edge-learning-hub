import type { RichPageData } from "@/components/rich-detail/types";
import { adobePlatformPages } from "./adobe-platform";
import { adobeCollectionPages } from "./adobe-collection";
import { akamaiPages } from "./akamai-all";

export const richPages: Record<string, RichPageData> = {
  ...adobePlatformPages,
  ...adobeCollectionPages,
  ...akamaiPages,
};
