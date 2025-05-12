import { z } from "zod";
import * as common from "@/backend/domain/common/types";

export const collectionID = common.positiveInt.brand<"CollectionID">();
export type CollectionID = z.infer<typeof collectionID>;
